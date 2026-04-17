require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false }
  }
);

async function insertSecurityQuestions() {
  const questions = [
    { question_text: 'What is your mother\'s maiden name?', category: 'personal' },
    { question_text: 'In what city were you born?', category: 'personal' },
    { question_text: 'What was name of your first pet?', category: 'childhood' },
    { question_text: 'What was your childhood nickname?', category: 'childhood' },
    { question_text: 'What was name of your first school?', category: 'childhood' },
    { question_text: 'What was your favorite subject in school?', category: 'education' },
    { question_text: 'What was name of your elementary school teacher?', category: 'education' },
    { question_text: 'What is your favorite food?', category: 'favorites' },
    { question_text: 'What is your favorite color?', category: 'favorites' },
    { question_text: 'What is your favorite book or movie?', category: 'favorites' },
    { question_text: 'What is your father\'s middle name?', category: 'family' },
    { question_text: 'What is your oldest sibling\'s name?', category: 'family' }
  ];

  try {
    console.log('Inserting security questions...');
    
    const { data, error } = await supabaseAdmin
      .from('security_questions')
      .upsert(questions, { onConflict: 'question_text' });

    if (error) {
      console.error('Error inserting questions:', error);
    } else {
      console.log('Successfully inserted', data?.length || 0, 'security questions');
    }

    // Verify insertion
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('security_questions')
      .select('*')
      .eq('is_active', true);

    if (verifyError) {
      console.error('Error verifying questions:', verifyError);
    } else {
      console.log('Verification: Found', verifyData?.length || 0, 'active security questions');
      console.log('Questions:', verifyData?.map(q => `${q.question_text} (${q.category})`));
    }

  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

insertSecurityQuestions();
