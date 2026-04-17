import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
        
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      business_id,
      feedback_type,
      title,
      description,
      email,
      priority,
      country,
      industry
    } = body;

    // Validate required fields
    if (!business_id || !feedback_type || !title || !description || !country || !industry) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate feedback_type
    const validTypes = ['bug_report', 'feature_request', 'general_feedback', 'complaint', 'compliment'];
    if (!validTypes.includes(feedback_type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority' },
        { status: 400 }
      );
    }

    // Verify that the user has access to this business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', business_id)
      .eq('id', user.id) // Ensure the user owns this business
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found or access denied' },
        { status: 403 }
      );
    }

    // Insert the feedback
    const { data: feedback, error: insertError } = await supabase
      .from('feedback')
      .insert({
        business_id,
        country,
        industry,
        feedback_type,
        title: title.trim(),
        description: description.trim(),
        email: email?.trim() || null,
        priority: priority || 'medium',
        metadata: {
          user_agent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          submitted_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting feedback:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
        
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const business_id = searchParams.get('business_id');
    const country = searchParams.get('country');
    const industry = searchParams.get('industry');
    const status = searchParams.get('status');
    const feedback_type = searchParams.get('feedback_type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('feedback')
      .select(`
        *,
        businesses (
          business_name,
          email
        )
      `)
      .eq('business_id', user.id) // Only return feedback for the current user's business
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (country) {
      query = query.eq('country', country);
    }
    if (industry) {
      query = query.eq('industry', industry);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (feedback_type) {
      query = query.eq('feedback_type', feedback_type);
    }

    const { data: feedback, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching feedback:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', user.id);

    if (countError) {
      console.error('Error counting feedback:', countError);
    }

    return NextResponse.json({
      success: true,
      data: feedback || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        has_more: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('Feedback GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

