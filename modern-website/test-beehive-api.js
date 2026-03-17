// Test script to verify the beehive API route works
// Run this in browser console

async function testBeehiveAPI() {
  console.log('🧪 Testing Beehive API Route (RLS Bypass)');
  console.log('==========================================');
  
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
  
  // Test creating a beehive request via API
  const requestData = {
    title: 'Test API Route Request',
    description: 'Testing if the API route bypasses RLS correctly',
    category: 'feature',
    priority: 'medium'
  };
  
  console.log('📝 Creating test request via API...');
  
  try {
    const response = await fetch('/api/beehive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addRequest',
        userId: session.userId,
        data: {
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
        }
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Beehive request created successfully via API!');
      console.log('📋 Request details:', {
        id: result.data?.id,
        title: result.data?.title,
        category: result.data?.category,
        priority: result.data?.priority,
        status: result.data?.status
      });
      console.log('🎉 API route bypasses RLS successfully!');
      
      // Test voting via API
      if (result.data?.id) {
        console.log('🗳️ Testing voting via API...');
        
        const voteResponse = await fetch('/api/beehive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'voteOnRequest',
            userId: session.userId,
            data: { 
              requestId: result.data.id, 
              voteType: 'up' 
            }
          })
        });
        
        if (voteResponse.ok) {
          console.log('✅ Vote submitted successfully via API!');
          console.log('🎉 Both create and vote operations work via API!');
        } else {
          const voteError = await voteResponse.text();
          console.error('❌ Failed to vote via API:', voteError);
        }
      }
      
    } else {
      const error = await response.text();
      console.error('❌ Failed to create request via API:', error);
      console.log('🔧 Checking if API route exists...');
    }
  } catch (error) {
    console.error('❌ Error testing beehive API:', error);
  }
}

console.log('🚀 Starting Beehive API test...');
testBeehiveAPI();
