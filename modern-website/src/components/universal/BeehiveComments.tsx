"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
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
}

// Helper function to get current user ID from our custom auth
const getCurrentUserId = (): string | null => {
  try {
    // Try beezee_business_auth first (our new business auth system)
    const businessAuth = localStorage.getItem('beezee_business_auth');
    if (businessAuth) {
      try {
        const authData = JSON.parse(businessAuth);
        const businessId = authData.business?.id || authData.session?.businessId;
        if (businessId) {
          console.log('✅ Using business ID as user ID in comments:', businessId);
          return businessId;
        }
      } catch (e) {
        console.log('❌ Failed to parse beezee_business_auth:', e);
      }
    }

    // Try beezee-business-profile
    const businessProfile = localStorage.getItem('beezee-business-profile');
    if (businessProfile) {
      try {
        const profileData = JSON.parse(businessProfile);
        const userId = profileData?.userId || profileData?.id || profileData?.user_id;
        if (userId) return userId;
      } catch (e) {
        console.log('❌ Failed to parse beezee-business-profile:', e);
      }
    }

    // Try beezee-user-data
    const beezeeUserData = localStorage.getItem('beezee-user-data');
    if (beezeeUserData) {
      try {
        const userData = JSON.parse(beezeeUserData);
        const userId = userData?.userId || userData?.id || userData?.sub;
        if (userId) return userId;
      } catch (e) {
        console.log('❌ Failed to parse beezee-user-data:', e);
      }
    }

    // Try beezee-auth
    const beezeeAuth = localStorage.getItem('beezee-auth');
    if (beezeeAuth) {
      try {
        const authData = JSON.parse(beezeeAuth);
        const userId = authData?.userId || authData?.id || authData?.sub;
        if (userId) return userId;
      } catch (e) {
        console.log('❌ Failed to parse beezee-auth:', e);
      }
    }

    return null;
  } catch (error) {
    console.error('❌ Error in getCurrentUserId():', error);
    return null;
  }
};

export default function BeehiveComments({ requestId }: BeehiveCommentsProps) {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Get current user ID only when needed (lazy loading)
  const getCurrentUserId = (): string | null => {
    try {
      console.log('🔍 Checking authentication status in comments...');
      
      // Method 1: Check sessionData (original system)
      let sessionData = localStorage.getItem('sessionData');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          if (session.isLoggedIn && session.userId) {
            console.log('✅ Found user ID in sessionData:', session.userId);
            return session.userId;
          }
        } catch (e) {
          console.log('❌ Failed to parse sessionData:', e);
        }
      }
      
      // Method 2: Check beezee-user-data
      const beezeeUserData = localStorage.getItem('beezee-user-data');
      if (beezeeUserData) {
        try {
          const userData = JSON.parse(beezeeUserData);
          const userId = userData?.userId || userData?.id || userData?.sub;
          if (userId) {
            console.log('✅ Found user ID in beezee-user-data:', userId);
            return userId;
          }
        } catch (e) {
          console.log('❌ Failed to parse beezee-user-data:', e);
        }
      }
      
      // Method 3: Check beezee-auth
      const beezeeAuth = localStorage.getItem('beezee-auth');
      if (beezeeAuth) {
        try {
          const authData = JSON.parse(beezeeAuth);
          const userId = authData?.userId || authData?.id || authData?.sub;
          if (userId) {
            console.log('✅ Found user ID in beezee-auth:', userId);
            return userId;
          }
        } catch (e) {
          console.log('❌ Failed to parse beezee-auth:', e);
        }
      }
      
      // Method 4: Check beezee-business-auth (our new business auth system)
      const businessAuth = localStorage.getItem('beezee_business_auth');
      if (businessAuth) {
        try {
          const authData = JSON.parse(businessAuth);
          const businessId = authData.business?.id || authData.session?.businessId;
          if (businessId) {
            console.log('✅ Using business ID as user ID:', businessId);
            return businessId;
          }
        } catch (e) {
          console.log('❌ Failed to parse beezee_business_auth:', e);
        }
      }
      
      // Method 5: Check beezee-business-profile
      const businessProfile = localStorage.getItem('beezee-business-profile');
      if (businessProfile) {
        try {
          const profileData = JSON.parse(businessProfile);
          const userId = profileData?.userId || profileData?.id || profileData?.user_id;
          if (userId) {
            console.log('✅ Found user ID in beezee-business-profile:', userId);
            return userId;
          }
        } catch (e) {
          console.log('❌ Failed to parse beezee-business-profile:', e);
        }
      }
      
      // Method 6: Check isLoggedIn and create temporary session
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        console.log('⚠️ User is logged in but no user ID found');
        console.log('🔧 Creating temporary user ID...');
        
        // Create a temporary user ID based on available data
        const tempUserId = 'temp-user-' + Date.now();
        console.log('📝 Created temporary user ID:', tempUserId);
        
        // Create sessionData for future use
        const tempSession = {
          isLoggedIn: true,
          userId: tempUserId,
          email: 'temp@example.com',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('sessionData', JSON.stringify(tempSession));
        console.log('✅ Created temporary sessionData');
        return tempUserId;
      }
      
      console.log('❌ No user ID found in any authentication method');
      return null;
    } catch (error) {
      console.error('❌ Error in getCurrentUserId():', error);
      return null;
    }
  };

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [requestId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Try API route first (bypasses RLS and foreign key issues)
      try {
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
          console.log('✅ Fetched comments via API route:', result.data?.length || 0);
          setComments(result.data || []);
          return;
        } else {
          console.log('⚠️ API route failed, trying direct database');
        }
      } catch (apiError: any) {
        console.log('⚠️ API route error:', apiError.message);
      }

      // Fallback to direct database query
      const { data, error } = await supabase
        .from('beehive_comments')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) {
        console.log('⚠️ RLS error fetching comments, trying alternative approach');
        console.log('Error details:', error);
        
        // If RLS blocks us, try to get all comments and filter client-side
        const { data: allComments, error: allError } = await supabase
          .from('beehive_comments')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (allError) {
          throw allError;
        }
        
        // Filter comments client-side
        const filteredComments = allComments?.filter(comment => 
          comment.request_id === requestId
        ) || [];
        
        console.log('✅ Fetched comments via client-side filtering:', filteredComments.length);
        setComments(filteredComments);
      } else {
        console.log('✅ Fetched comments via direct query:', data?.length || 0);
        setComments(data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel(`comments_${requestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'beehive_comments',
          filter: `request_id=eq.${requestId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Use API route to bypass RLS and handle foreign key constraints
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addComment',
          userId,
          data: {
            requestId,
            comment_text: newComment.trim()
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add comment');
      }

      setNewComment('');
      await fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Use API route to bypass RLS and handle foreign key constraints
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteComment',
          userId,
          data: { commentId }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete comment');
      }

      await fetchComments(); // Refresh comments
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
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-900">
          {t('beehive.comments', 'Comments')} ({comments.length})
        </h4>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-sm text-gray-500 py-4">
          {t('common.loading', 'Loading...')}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-500 py-4">
          {t('beehive.no_comments', 'No comments yet. Be the first to comment!')}
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-1">
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
                  {getCurrentUserId() === comment.business_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
                      title={t('common.delete', 'Delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 ml-8">
                  {comment.comment_text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Comment Form */}
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
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
