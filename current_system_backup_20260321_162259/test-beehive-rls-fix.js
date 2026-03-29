// Test script to verify beehive requests work after RLS fix
// Run this in browser console

async function testBeehiveRequest() {
  console.log('🧪 Testing Beehive Request Creation (RLS Fixed)');
  console.log('===============================================');
  
  // Get current user info
  const sessionData = localStorage.getItem('sessionData');
  const userProfile = localStorage.getItem('userProfile');
  
  if (!sessionData || !userProfile) {
    console.error('❌ No user session found. Please sign in first.');
    return;
  }
  
  const session = JSON.parse(sessionData);
  const profile = JSON.parse(userProfile);
  
  console.log('✅ User authenticated:', session.userId);
  console.log('🏢 Business:', profile.businessName);
  console.log('🌍 Country:', profile.country);
  console.log('🏭 Industry:', profile.industry);
  
  // Test creating a beehive request
  const requestData = {
    title: 'Test Auto-Refresh Feature Request',
    description: 'Please add auto-refresh to all data hooks for real-time updates without manual page refresh',
    category: 'feature',
    priority: 'high'
  };
  
  console.log('📝 Creating test request...');
  
  try {
    // Direct API call to test the fix
    const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/beehive_requests', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...requestData,
        industry: profile.industry || 'retail',
        country: profile.country || 'KE',
        user_id: session.userId,
        business_id: profile.businessId || null,
        status: 'active',
        upvotes_count: 0,
        downvotes_count: 0,
        comments_count: 0,
        is_featured: false,
        metadata: {}
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Beehive request created successfully!');
      console.log('📋 Request details:', {
        id: data[0]?.id,
        title: data[0]?.title,
        category: data[0]?.category,
        priority: data[0]?.priority,
        status: data[0]?.status
      });
      console.log('🎉 RLS issue has been fixed!');
      console.log('📱 You can now create requests through the Beehive interface');
      
      // Test fetching requests to make sure it works
      console.log('🔄 Testing fetch requests...');
      const fetchResponse = await fetch(
        `https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/beehive_requests?industry=eq.${profile.industry || 'retail'}&country=eq.${profile.country || 'KE'}&order=created_at.desc`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`
          }
        }
      );
      
      if (fetchResponse.ok) {
        const requests = await fetchResponse.json();
        console.log(`✅ Successfully fetched ${requests.length} requests`);
        console.log('📊 Recent requests:', requests.slice(0, 3).map(r => ({
          title: r.title,
          category: r.category,
          votes: `${r.upvotes_count}↑/${r.downvotes_count}↓`
        })));
      } else {
        console.error('❌ Failed to fetch requests:', await fetchResponse.text());
      }
      
    } else {
      const error = await response.text();
      console.error('❌ Failed to create request:', error);
      if (error.includes('42501')) {
        console.log('🔧 RLS policy still blocking - checking if supabaseAdmin is being used correctly...');
      }
    }
  } catch (error) {
    console.error('❌ Error testing beehive:', error);
  }
}

console.log('🚀 Starting Beehive RLS fix test...');
testBeehiveRequest();
