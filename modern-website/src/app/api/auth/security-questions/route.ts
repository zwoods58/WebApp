import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side admin client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

/**
 * GET /api/auth/security-questions
 * Fetch all active security questions for signup
 * 
 * Returns: { success: boolean, questions: SecurityQuestion[] }
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📋 [API] Fetching active security questions');

    // Fetch all active security questions
    const { data: questions, error } = await supabaseAdmin
      .from('security_questions')
      .select('id, question_text, category')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('question_text', { ascending: true });

    if (error) {
      console.error('❌ [API] Error fetching security questions:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch security questions',
        questions: []
      }, { status: 500 });
    }

    console.log(`✅ [API] Retrieved ${questions?.length || 0} security questions`);

    return NextResponse.json({
      success: true,
      error: null,
      questions: questions || []
    });

  } catch (err) {
    console.error('💥 [API] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      questions: []
    }, { status: 500 });
  }
}
