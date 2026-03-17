// Server-side API route for beehive operations
// This bypasses RLS by using service role key on the server

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data, userId, industry, country } = body;

    if (!userId && action !== 'list' && action !== 'listComments') {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'addRequest':
        // Validate business_id exists in businesses table
        let validBusinessId = data.business_id;
        
        if (data.business_id) {
          const { data: businessExists } = await supabaseAdmin
            .from('businesses')
            .select('id')
            .eq('id', data.business_id)
            .single();
          
          if (!businessExists) {
            console.log('Business ID does not exist, setting to null:', data.business_id);
            validBusinessId = null;
          }
        }
        
        // Validate user_id exists in users table (or set to null if no users table)
        let validUserId = userId;
        
        // Check if there's a users table and if user_id exists
        try {
          const { data: userExists } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();
          
          if (!userExists) {
            console.log('User ID does not exist in users table, setting to null:', userId);
            validUserId = null;
          }
        } catch (error) {
          // If users table doesn't exist, we'll allow the user_id as-is
          console.log('Users table may not exist, allowing user_id as-is');
        }
        
        // Insert with validated IDs
        const { data: requestData, error: addError } = await supabaseAdmin
          .from('beehive_requests')
          .insert([{
            ...data,
            business_id: validBusinessId,
            user_id: validUserId
          }])
          .select()
          .single();

        if (addError) throw addError;
        return Response.json({ data: requestData });

      case 'list':
        // List requests for a specific industry and country
        let query = supabaseAdmin
          .from('beehive_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (industry) {
          query = query.eq('industry', industry);
        }
        if (country) {
          query = query.eq('country', country);
        }

        const { data: requests, error: listError } = await query;

        if (listError) throw listError;
        return Response.json({ data: requests || [] });

      case 'voteOnRequest':
        const { requestId, voteType } = data;
        
        // Validate user_id exists in users table (or set to null if no users table)
        let validVoteUserId = userId;
        
        try {
          const { data: userExists } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();
          
          if (!userExists) {
            console.log('User ID does not exist in users table, setting to null:', userId);
            validVoteUserId = null;
          }
        } catch (error) {
          // If users table doesn't exist, we'll allow the user_id as-is
          console.log('Users table may not exist, allowing user_id as-is');
        }
        
        // Check for existing vote
        const { data: existingVote } = await supabaseAdmin
          .from('beehive_votes')
          .select('*')
          .eq('request_id', requestId)
          .eq('user_id', validVoteUserId)
          .single();

        if (existingVote) {
          if (existingVote.vote_type === voteType) {
            // Remove vote
            await supabaseAdmin
              .from('beehive_votes')
              .delete()
              .eq('id', existingVote.id);

            // Update vote count
            const { data: request } = await supabaseAdmin
              .from('beehive_requests')
              .select('upvotes_count, downvotes_count')
              .eq('id', requestId)
              .single();
            
            if (request) {
              const updateField = voteType === 'up' ? 'upvotes_count' : 'downvotes_count';
              await supabaseAdmin
                .from('beehive_requests')
                .update({ [updateField]: Math.max(0, request[updateField] - 1) })
                .eq('id', requestId);
            }
          } else {
            // Change vote type
            await supabaseAdmin
              .from('beehive_votes')
              .update({ vote_type: voteType })
              .eq('id', existingVote.id);

            // Update vote counts
            const { data: request } = await supabaseAdmin
              .from('beehive_requests')
              .select('upvotes_count, downvotes_count')
              .eq('id', requestId)
              .single();
            
            if (request) {
              const incrementField = voteType === 'up' ? 'upvotes_count' : 'downvotes_count';
              const decrementField = voteType === 'up' ? 'downvotes_count' : 'upvotes_count';
              await supabaseAdmin
                .from('beehive_requests')
                .update({
                  [incrementField]: request[incrementField] + 1,
                  [decrementField]: Math.max(0, request[decrementField] - 1)
                })
                .eq('id', requestId);
            }
          }
        } else {
          // Create new vote
          await supabaseAdmin
            .from('beehive_votes')
            .insert([{
              request_id: requestId,
              user_id: validVoteUserId,
              vote_type: voteType
            }]);

          // Update vote count
          const { data: request } = await supabaseAdmin
            .from('beehive_requests')
            .select('upvotes_count, downvotes_count')
            .eq('id', requestId)
            .single();
          
          if (request) {
            const updateField = voteType === 'up' ? 'upvotes_count' : 'downvotes_count';
            await supabaseAdmin
              .from('beehive_requests')
              .update({ [updateField]: request[updateField] + 1 })
              .eq('id', requestId);
          }
        }

        return Response.json({ success: true });

      case 'addComment':
        const { requestId: commentRequestId, comment_text } = data;
        
        // Validate business_id exists in businesses table
        let validCommentBusinessId = userId;
        
        if (userId) {
          const { data: businessExists } = await supabaseAdmin
            .from('businesses')
            .select('id')
            .eq('id', userId)
            .single();
          
          if (!businessExists) {
            console.log('Business ID does not exist, setting to null:', userId);
            validCommentBusinessId = null;
          }
        }
        
        // Add comment
        const { data: commentData, error: commentError } = await supabaseAdmin
          .from('beehive_comments')
          .insert([{
            request_id: commentRequestId,
            business_id: validCommentBusinessId,
            comment_text: comment_text
          }])
          .select()
          .single();

        if (commentError) throw commentError;

        // Update comment count on the request
        try {
          await supabaseAdmin.rpc('increment_comment_count', {
            request_id_param: commentRequestId
          });
        } catch (rpcError) {
          console.log('RPC function may not exist, updating comment count manually');
          // Fallback: update comment count manually
          const { data: request } = await supabaseAdmin
            .from('beehive_requests')
            .select('comments_count')
            .eq('id', commentRequestId)
            .single();
          
          if (request) {
            await supabaseAdmin
              .from('beehive_requests')
              .update({ comments_count: request.comments_count + 1 })
              .eq('id', commentRequestId);
          }
        }

        return Response.json({ data: commentData });

      case 'deleteComment':
        const { commentId } = data;
        
        // Get comment to verify ownership
        const { data: commentToDelete } = await supabaseAdmin
          .from('beehive_comments')
          .select('*')
          .eq('id', commentId)
          .single();
        
        if (!commentToDelete) {
          return Response.json({ error: 'Comment not found' }, { status: 404 });
        }

        // Validate business_id exists in businesses table
        let validDeleteBusinessId = userId;
        
        if (userId) {
          const { data: businessExists } = await supabaseAdmin
            .from('businesses')
            .select('id')
            .eq('id', userId)
            .single();
          
          if (!businessExists) {
            validDeleteBusinessId = null;
          }
        }
        
        // Check if user owns the comment
        if (commentToDelete.business_id !== validDeleteBusinessId) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Delete comment
        const { error: deleteError } = await supabaseAdmin
          .from('beehive_comments')
          .delete()
          .eq('id', commentId);

        if (deleteError) throw deleteError;

        // Update comment count on the request
        try {
          await supabaseAdmin.rpc('decrement_comment_count', {
            request_id_param: commentToDelete.request_id
          });
        } catch (rpcError) {
          console.log('RPC function may not exist, updating comment count manually');
          // Fallback: update comment count manually
          const { data: request } = await supabaseAdmin
            .from('beehive_requests')
            .select('comments_count')
            .eq('id', commentToDelete.request_id)
            .single();
          
          if (request) {
            await supabaseAdmin
              .from('beehive_requests')
              .update({ comments_count: Math.max(0, request.comments_count - 1) })
              .eq('id', commentToDelete.request_id);
          }
        }

        return Response.json({ success: true });

      case 'listComments':
        const { requestId: commentsRequestId } = data;
        
        // List comments for a specific request
        const { data: comments, error: commentsError } = await supabaseAdmin
          .from('beehive_comments')
          .select('*')
          .eq('request_id', commentsRequestId)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;
        return Response.json({ data: comments || [] });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Beehive API error:', error);
    return Response.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
