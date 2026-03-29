// Debug script to check Beehive submission flow
// Run this in browser console

function debugBeehiveSubmission() {
  console.log('🔍 Debugging Beehive Submission Flow');
  console.log('=====================================');
  
  // Check if we can see the requests list
  console.log('📋 Checking current requests...');
  
  // Get the current user ID
  const businessProfile = localStorage.getItem('beezee-business-profile');
  let userId = null;
  
  if (businessProfile) {
    try {
      const profileData = JSON.parse(businessProfile);
      userId = profileData?.userId || profileData?.id || profileData?.user_id;
      console.log('✅ User ID:', userId);
    } catch (e) {
      console.log('❌ Failed to parse beezee-business-profile:', e);
      return;
    }
  }
  
  if (!userId) {
    console.log('❌ No user ID found');
    return;
  }
  
  // Check current requests via API
  console.log('\n📋 Fetching current requests...');
  fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/beehive_requests?user_id=eq.' + userId + '&order=created_at.desc', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ'
    }
  })
  .then(response => response.json())
  .then(requests => {
    console.log('✅ Current requests count:', requests.length);
    if (requests.length > 0) {
      console.log('📋 Latest request:', requests[0]);
      console.log('   Title:', requests[0].title);
      console.log('   Created:', requests[0].created_at);
      console.log('   Status:', requests[0].status);
    } else {
      console.log('📋 No requests found');
    }
    
    // Test creating a new request
    console.log('\n🧪 Creating a test request...');
    
    const testData = {
      title: 'Debug Test Request ' + Date.now(),
      description: 'This is a test request to debug the submission flow',
      category: 'feature',
      priority: 'medium'
    };
    
    return fetch('/api/beehive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addRequest',
        userId: userId,
        data: {
          ...testData,
          industry: 'retail',
          country: 'KE',
          user_id: userId,
          business_id: null, // Use null to avoid foreign key issues
          status: 'active',
          upvotes_count: 0,
          downvotes_count: 0,
          comments_count: 0,
          is_featured: false,
          metadata: {}
        }
      })
    });
  })
  .then(response => {
    console.log('📡 Creation response status:', response.status);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(result => {
    console.log('✅ Request created successfully!');
    console.log('📋 Request ID:', result.data?.id);
    console.log('📝 Title:', result.data?.title);
    console.log('📅 Created at:', result.data?.created_at);
    
    // Check if request appears in list immediately
    console.log('\n🔍 Checking if request appears in list...');
    
    setTimeout(() => {
      fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/beehive_requests?user_id=eq.' + userId + '&order=created_at.desc', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ'
        }
      })
      .then(response => response.json())
      .then(updatedRequests => {
        console.log('✅ Updated requests count:', updatedRequests.length);
        if (updatedRequests.length > 0) {
          console.log('📋 Latest request after creation:', updatedRequests[0]);
          console.log('   Title:', updatedRequests[0].title);
          console.log('   Created:', updatedRequests[0].created_at);
          
          // Check if our new request is in the list
          const ourRequest = updatedRequests.find(r => r.title.includes('Debug Test Request'));
          if (ourRequest) {
            console.log('✅ Our test request is in the list!');
            console.log('🎉 Database update is working');
          } else {
            console.log('❌ Our test request is not in the list');
            console.log('🔧 There might be a delay or issue with the database');
          }
        }
        
        console.log('\n📊 Summary:');
        console.log('✅ API call: Successful');
        console.log('✅ Database insertion: Successful');
        console.log('✅ Request appears in database: ' + (ourRequest ? 'Yes' : 'No'));
        
        if (ourRequest) {
          console.log('\n🎯 The issue is likely in the UI not refreshing the requests list');
          console.log('🔧 Check if the useBeehive hook is properly refreshing after addRequest');
          console.log('💡 The modal closes but the UI might not be updating');
        }
      })
      .catch(error => {
        console.error('❌ Error checking updated requests:', error);
      });
    }, 2000); // Wait 2 seconds for database to update
  })
  .catch(error => {
    console.error('❌ Failed to create request:', error.message);
  });
}

console.log('🚀 Starting Beehive submission debug...');
debugBeehiveSubmission();
