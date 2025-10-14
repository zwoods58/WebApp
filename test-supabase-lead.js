// Test Supabase Lead Creation
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSupabaseLead() {
  console.log('📝 Testing Supabase Lead Creation...\n')
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Test creating a lead with valid user ID
    console.log('📝 Creating test lead...')
    const testLead = {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@test.com',
      company: 'Test Company',
      phone: '(555) 123-4567',
      industry: 'Technology',
      website: 'https://test.com',
      status: 'NEW',
      score: 75,
      user_id: '00000000-0000-0000-0000-000000000002' // Sales user ID
    }
    
    const { data: newLead, error: createError } = await supabase
      .from('leads')
      .insert(testLead)
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Lead creation failed:', createError.message)
      console.error('Details:', createError)
    } else {
      console.log('✅ Lead creation successful!')
      console.log('New Lead:', JSON.stringify(newLead, null, 2))
      
      // Test fetching the lead
      console.log('\n🔍 Testing lead fetch...')
      const { data: fetchedLead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', newLead.id)
        .single()
      
      if (fetchError) {
        console.error('❌ Lead fetch failed:', fetchError.message)
      } else {
        console.log('✅ Lead fetch successful!')
        console.log('Fetched Lead:', JSON.stringify(fetchedLead, null, 2))
      }
      
      // Clean up
      console.log('\n🧹 Cleaning up test lead...')
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', newLead.id)
      
      if (deleteError) {
        console.error('❌ Lead deletion failed:', deleteError.message)
      } else {
        console.log('✅ Test lead cleaned up')
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
  }
}

testSupabaseLead()
