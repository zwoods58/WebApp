import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { requestId?: string; voteType?: 'up' | 'down'; business_id?: string };
    const { requestId, voteType, business_id } = body;

    console.log('📊 [VOTE API] Received vote request:', { requestId, voteType, business_id });

    if (!requestId || !voteType || !business_id) {
      console.error('❌ [VOTE API] Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const dbVoteType = voteType === 'up' ? 'upvote' : 'downvote';

    // First, check if request exists and get creator info
    const { data: requestExists, error: requestCheckError } = await supabaseAdmin
      .from('beehive_requests')
      .select('id, business_id')
      .eq('id', requestId)
      .single();

    if (requestCheckError || !requestExists) {
      console.error('❌ [VOTE API] Request not found:', requestId);
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    // Check if user is trying to vote on their own request
    if (requestExists.business_id === business_id) {
      console.error('❌ [VOTE API] User trying to vote on own request:', { requestId, business_id });
      return NextResponse.json(
        { success: false, error: 'You cannot vote on your own request' },
        { status: 400 }
      );
    }

    // Check for existing vote - FIXED: Use correct column names
    const { data: existingVote, error: voteCheckError } = await supabaseAdmin
      .from('beehive_votes')
      .select('*')
      .eq('request_id', requestId)
      .eq('business_id', business_id) // CHANGED: Use business_id instead of user_id
      .maybeSingle(); // CHANGED: Use maybeSingle() instead of single() to avoid PGRST116 error

    console.log('🔍 [VOTE API] Existing vote check:', { existingVote, voteCheckError });

    // Get current request vote counts
    const { data: request, error: requestError } = await supabaseAdmin
      .from('beehive_requests')
      .select('upvotes_count, downvotes_count')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      console.error('❌ [VOTE API] Failed to get request:', requestError);
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    let upvotesCount = request.upvotes_count || 0;
    let downvotesCount = request.downvotes_count || 0;

    if (existingVote) {
      console.log('🔄 [VOTE API] Existing vote found, updating...');
      
      if (existingVote.vote_type === dbVoteType) {
        // Remove vote (user clicked same vote again)
        const { error: deleteError } = await supabaseAdmin
          .from('beehive_votes')
          .delete()
          .eq('request_id', requestId)
          .eq('business_id', business_id);

        if (deleteError) {
          console.error('❌ [VOTE API] Failed to delete vote:', deleteError);
          throw deleteError;
        }

        // Decrement appropriate counter
        if (voteType === 'up') {
          upvotesCount = Math.max(0, upvotesCount - 1);
        } else {
          downvotesCount = Math.max(0, downvotesCount - 1);
        }
        console.log('🗑️ [VOTE API] Vote removed');
      } else {
        // Change vote type
        const { error: updateError } = await supabaseAdmin
          .from('beehive_votes')
          .update({ vote_type: dbVoteType, updated_at: new Date().toISOString() })
          .eq('request_id', requestId)
          .eq('business_id', business_id);

        if (updateError) {
          console.error('❌ [VOTE API] Failed to update vote:', updateError);
          throw updateError;
        }

        // Adjust counters
        if (voteType === 'up') {
          upvotesCount += 1;
          downvotesCount = Math.max(0, downvotesCount - 1);
        } else {
          downvotesCount += 1;
          upvotesCount = Math.max(0, upvotesCount - 1);
        }
        console.log('🔄 [VOTE API] Vote changed from', existingVote.vote_type, 'to', dbVoteType);
      }
    } else {
      // Create new vote
      console.log('✨ [VOTE API] Creating new vote...');
      const { error: insertError } = await supabaseAdmin
        .from('beehive_votes')
        .insert([{
          request_id: requestId,
          business_id: business_id, // CHANGED: Use business_id
          vote_type: dbVoteType,
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('❌ [VOTE API] Failed to insert vote:', insertError);
        throw insertError;
      }

      // Increment appropriate counter
      if (voteType === 'up') {
        upvotesCount += 1;
      } else {
        downvotesCount += 1;
      }
      console.log('✅ [VOTE API] New vote created');
    }

    // Update request vote counts
    const { error: updateError } = await supabaseAdmin
      .from('beehive_requests')
      .update({
        upvotes_count: upvotesCount,
        downvotes_count: downvotesCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('❌ [VOTE API] Failed to update request counts:', updateError);
      throw updateError;
    }

    console.log('✅ [VOTE API] Vote processed successfully:', { upvotesCount, downvotesCount });

    return NextResponse.json({
      success: true,
      upvotes: upvotesCount,
      downvotes: downvotesCount
    });
  } catch (error: any) {
    console.error('❌ [VOTE API] Error handling vote:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

