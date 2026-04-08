// =====================================================
// LIBRARY: Chat Storage Service
// PURPOSE: Store chat messages in file storage (not database)
// USAGE: const chat = new ChatStorage();
//        await chat.sendMessage(chatId, userId, message);
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { compress, decompress } from './compression';

export interface ChatMessage {
  id?: string;
  chatId: string;
  userId: string;
  message: string;
  sentAt: Date;
  readAt?: Date;
  messageLength: number;
}

export interface ChatMessageMetadata {
  message_path: string;
  user_id: string;
  sent_at: string;
  read_at?: string;
  message_length: number;
}

export class ChatStorage {
  private supabase;
  private bucketName = 'beehive-messages';

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Send a message - stores in file storage, metadata in database
   */
  async sendMessage(chatId: string, userId: string, message: string): Promise<{ success: boolean; path?: string; error?: string }> {
    try {
      const timestamp = Date.now();
      const compressedMessage = await compress(message);
      
      // Create file path: user_id/chat_id/timestamp.txt
      const filePath = `${userId}/${chatId}/${timestamp}.txt.gz`;
      
      // Upload compressed message to storage
      const { error: uploadError } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, compressedMessage, {
          contentType: 'application/gzip',
          cacheControl: '31536000', // Cache for 1 year
          upsert: false,
        });
      
      if (uploadError) throw uploadError;
      
      // Store metadata in database
      const { error: dbError } = await this.supabase
        .from('chat_messages_index')
        .insert({
          chat_id: chatId,
          user_id: userId,
          message_path: filePath,
          message_length: message.length,
          sent_at: new Date(timestamp).toISOString(),
        });
      
      if (dbError) {
        // Rollback: delete the file if metadata insert fails
        await this.supabase.storage
          .from(this.bucketName)
          .remove([filePath]);
        throw dbError;
      }
      
      return { success: true, path: filePath };
      
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get messages for a chat (most recent first)
   */
  async getMessages(chatId: string, limit: number = 50, before?: Date): Promise<ChatMessage[]> {
    try {
      // Query metadata from database
      let query = this.supabase
        .from('chat_messages_index')
        .select('message_path, user_id, sent_at, read_at, message_length')
        .eq('chat_id', chatId)
        .order('sent_at', { ascending: false })
        .limit(limit);
      
      if (before) {
        query = query.lt('sent_at', before.toISOString());
      }
      
      const { data: metadata, error } = await query;
      
      if (error) throw error;
      if (!metadata || metadata.length === 0) return [];
      
      // Fetch actual messages from storage
      const messages: (ChatMessage | null)[] = await Promise.all(
        metadata.map(async (meta: ChatMessageMetadata) => {
          const { data: fileData, error: downloadError } = await this.supabase.storage
            .from(this.bucketName)
            .download(meta.message_path);
          
          if (downloadError) {
            console.error('Failed to download message:', meta.message_path, downloadError);
            return null;
          }
          
          const compressedText = await fileData.text();
          const message = await decompress(compressedText);
          
          return {
            chatId,
            userId: meta.user_id,
            message,
            sentAt: new Date(meta.sent_at),
            readAt: meta.read_at ? new Date(meta.read_at) : undefined,
            messageLength: meta.message_length,
          };
        })
      );
      
      // Filter out failed downloads and reverse to chronological order
      return messages
        .filter((m): m is ChatMessage => m !== null)
        .reverse();
      
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string, userId: string, messageIds?: string[]): Promise<boolean> {
    try {
      let query = this.supabase
        .from('chat_messages_index')
        .update({ read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .not('user_id', 'eq', userId) // Don't mark own messages as read
        .is('read_at', null);
      
      if (messageIds && messageIds.length > 0) {
        query = query.in('id', messageIds);
      }
      
      const { error } = await query;
      
      if (error) throw error;
      return true;
      
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      return false;
    }
  }

  /**
   * Delete old messages (admin function)
   */
  async deleteOldMessages(olderThanDays: number = 30): Promise<{ deleted: number; error?: string }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      // Get old messages from index
      const { data: oldMessages, error: fetchError } = await this.supabase
        .from('chat_messages_index')
        .select('message_path')
        .lt('sent_at', cutoffDate.toISOString());
      
      if (fetchError) throw fetchError;
      
      if (!oldMessages || oldMessages.length === 0) {
        return { deleted: 0 };
      }
      
      // Delete files from storage
      const paths = oldMessages.map(m => m.message_path);
      const { error: deleteError } = await this.supabase.storage
        .from(this.bucketName)
        .remove(paths);
      
      if (deleteError) throw deleteError;
      
      // Delete metadata from database
      const { error: dbDeleteError } = await this.supabase
        .from('chat_messages_index')
        .delete()
        .lt('sent_at', cutoffDate.toISOString());
      
      if (dbDeleteError) throw dbDeleteError;
      
      return { deleted: oldMessages.length };
      
    } catch (error) {
      console.error('Failed to delete old messages:', error);
      return { deleted: 0, error: (error as Error).message };
    }
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('chat_messages_index')
        .select('*', { count: 'exact', head: true })
        .not('user_id', 'eq', userId)
        .is('read_at', null);
      
      if (error) throw error;
      return count || 0;
      
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }
}

// Singleton instance
export const chatStorage = new ChatStorage();
