import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUserContent } from '@/lib/validation/sanitizer';
import { supabaseAdmin } from '@/lib/supabase';

// GET: Fetch requests filtered by country + industry
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const industry = searchParams.get('industry');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabaseAdmin
      .from('beehive_requests')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (country) query = query.eq('country', country);
    if (industry) query = query.eq('industry', industry);
    if (category && category !== 'all') query = query.eq('category', category);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: requests, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: requests || []
    });
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, priority, business_id, country, industry } = body;

    // Validate required fields
    if (!title || !description || !business_id || !country || !industry) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize user content
    const sanitizedTitle = sanitizeUserContent(title, 200);
    const sanitizedDescription = sanitizeUserContent(description);

    const { data: newRequest, error } = await supabaseAdmin
      .from('beehive_requests')
      .insert([{
        title: sanitizedTitle,
        description: sanitizedDescription,
        category: category || 'new_feature',
        priority: priority || 'medium',
        business_id,
        country,
        industry,
        status: 'open',
        upvotes_count: 0,
        downvotes_count: 0,
        comments_count: 0,
        is_featured: false
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: newRequest
    });
  } catch (error: any) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete request (owner or admin only)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json() as { requestId?: string; business_id?: string };
    const { requestId, business_id } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: 'Request ID required' },
        { status: 400 }
      );
    }

    // First check if user owns the request
    const { data: requestRecord, error: fetchError } = await supabaseAdmin
      .from('beehive_requests')
      .select('business_id')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;
    if (!requestRecord) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    if (requestRecord.business_id !== business_id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete votes and comments first (cascade)
    await supabaseAdmin.from('beehive_votes').delete().eq('request_id', requestId);
    await supabaseAdmin.from('beehive_comments').delete().eq('request_id', requestId);

    // Delete the request
    const { error: deleteError } = await supabaseAdmin
      .from('beehive_requests')
      .delete()
      .eq('id', requestId);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
