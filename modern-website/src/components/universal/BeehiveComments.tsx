"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: string;
  request_id: string;
  business_id: string;
  comment_text: string;
  created_at: string;
}

interface BeehiveCommentsProps {
  requestId: string;
  onCommentAdded?: () => void;
}

export default function BeehiveComments({ requestId, onCommentAdded }: BeehiveCommentsProps) {
  const { t } = useLanguage();
  const { business, user } = useSupabaseAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Get current business ID from UnifiedAuth
  const getCurrentBusinessId = (): string | null => {
    const businessId = business?.id || user?.id || null;
    return businessId;
  };

  // Simplified fetching without real-time subscriptions
  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Use simple API call
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'listComments',
          data: { requestId }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setComments(result.data || []);
      } else {
        // Fallback to direct database query
        const { data, error } = await supabase
          .from('beehive_comments')
          .select('*')
          .eq('request_id', requestId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching comments:', error);
        } else {
          setComments(data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [requestId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    const businessId = getCurrentBusinessId();
    if (!businessId) {
      console.error('Business not authenticated');
      return;
    }

    setSubmitting(true);
    try {
      // Use existing API for now
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addComment',
          userId: businessId,
          data: {
            requestId,
            comment_text: newComment.trim()
          }
        })
      });

      if (response.ok) {
        setNewComment('');
        await fetchComments(); // Simple refresh
        onCommentAdded?.();
      } else {
        const error = await response.json();
        console.error('Failed to add comment:', error.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const businessId = getCurrentBusinessId();
    if (!businessId) return;

    try {
      // Use existing API for now
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteComment',
          userId: businessId,
          data: { commentId }
        })
      });

      if (response.ok) {
        await fetchComments(); // Simple refresh
      } else {
        const error = await response.json();
        console.error('Failed to delete comment:', error.error);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return t('time.just_now', 'Just now');
    if (seconds < 3600) return `${Math.floor(seconds / 60)}${t('time.m', 'm')}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}${t('time.h', 'h')}`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}${t('time.d', 'd')}`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white z-10 py-2">
        <MessageSquare size={16} className="text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-900">
          {t('beehive.comments', 'Comments')} ({comments.length})
        </h4>
      </div>

      {/* Comments List */}
      <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
        {loading ? (
          <div className="text-sm text-gray-500 py-4">
            {t('common.loading', 'Loading...')}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-gray-500 py-4">
            {t('beehive.no_comments', 'No comments yet. Be the first to comment!')}
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="fade-in bg-gray-50 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                    👤
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {t('beehive.community_member', 'Community Member')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                </div>
                {getCurrentBusinessId() === comment.business_id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
                    title={t('common.delete', 'Delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 break-words">
                {comment.comment_text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <div className="sticky bottom-0 bg-white pt-2 border-t border-gray-100">
        <form onSubmit={handleAddComment} className="flex items-start gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('beehive.add_comment', 'Add a comment...')}
            rows={2}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

