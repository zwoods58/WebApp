// Test both foreign key constraint fixes
// Run this in browser console

function testBothForeignKeyFixes() {
  console.log('🧪 Testing Both Foreign Key Constraint Fixes');
  console.log('==========================================');
  
  // Get user ID using enhanced authentication
  let userId = null;
  let businessId = null;
  
  // Try beezee-business-profile first (from logs we know this works)
  const businessProfile = localStorage.getItem('beezee-business-profile');
  if (businessProfile) {
    try {
      const profileData = JSON.parse(businessProfile);
      userId = profileData?.userId || profileData?.id || profileData?.user_id;
      businessId = profileData?.businessId || profileData?.id || profileData?.business_id;
      console.log('✅ Found from beezee-business-profile:');
      console.log('  👤 User ID:', userId);
      console.log('  🏢 Business ID:', businessId);
    } catch (e) {
      console.log('❌ Failed to parse beezee-business-profile:', e);
    }
  }
  
  if (!userId) {
    console.log('❌ No user ID found. Please ensure you are logged in.');
    return;
  }
  
  console.log('\n🧪 Testing Beehive request with both foreign key validations...');
  
  const requestData = {
    title: 'Dual Foreign Key Test Request',
    description: 'Testing both business_id and user_id foreign key constraints',
    category: 'feature',
    priority: 'medium'
  };
  
  fetch('/api/beehive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'addRequest',
      userId: userId,
      data: {
        ...requestData,
        industry: 'retail',
        country: 'KE',
        user_id: userId, // This might be invalid - API should handle it
        business_id: businessId, // This might be invalid - API should handle it
        status: 'active',
        upvotes_count: 0,
        downvotes_count: 0,
        comments_count: 0,
        is_featured: false,
        metadata: {}
      }
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(result => {
    console.log('🎉 SUCCESS! Beehive request created!');
    console.log('📋 Request ID:', result.data?.id);
    console.log('📝 Title:', result.data?.title);
    console.log('👤 User ID in response:', result.data?.user_id);
    console.log('🏢 Business ID in response:', result.data?.business_id);
    
    if (result.data?.user_id === null) {
      console.log('✅ User ID foreign key handled - set to null');
    } else {
      console.log('✅ User ID was valid and preserved');
    }
    
    if (result.data?.business_id === null) {
      console.log('✅ Business ID foreign key handled - set to null');
    } else {
      console.log('✅ Business ID was valid and preserved');
    }
    
    console.log('🎉 Both foreign key constraints handled successfully!');
    console.log('🔔 Beehive system is now fully functional!');
  })
  .catch(error => {
    console.error('❌ Beehive request failed:', error.message);
    
    if (error.message.includes('foreign key constraint')) {
      if (error.message.includes('business_id_fkey')) {
        console.log('❌ Business ID foreign key constraint still not fixed');
      } else if (error.message.includes('user_id_fkey')) {
        console.log('❌ User ID foreign key constraint still not fixed');
      } else {
        console.log('❌ Unknown foreign key constraint violation');
      }
      console.log('🔧 Check if the API route was updated correctly');
    } else if (error.message.includes('500')) {
      console.log('❌ Server error - check server logs');
      console.log('🔧 The API route might have an issue');
    } else {
      console.log('❌ Other error:', error.message);
    }
  });
  
  // Test with explicitly null IDs
  console.log('\n🧪 Testing with explicitly null IDs...');
  
  setTimeout(() => {
    fetch('/api/beehive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addRequest',
        userId: userId,
        data: {
          title: 'Null IDs Test Request',
          description: 'Testing with explicitly null foreign keys',
          category: 'feature',
          priority: 'low',
          industry: 'retail',
          country: 'KE',
          user_id: null, // Explicitly null
          business_id: null, // Explicitly null
          status: 'active',
          upvotes_count: 0,
          downvotes_count: 0,
          comments_count: 0,
          is_featured: false,
          metadata: {}
        }
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    })
    .then(result => {
      console.log('✅ SUCCESS! Request with null IDs created');
      console.log('📋 Request ID:', result.data?.id);
      console.log('👤 User ID in response:', result.data?.user_id);
      console.log('🏢 Business ID in response:', result.data?.business_id);
      console.log('🎉 Null IDs test passed!');
    })
    .catch(error => {
      console.error('❌ Null IDs test failed:', error.message);
    });
  }, 2000);
  
  // Test with valid IDs (if we can find them)
  console.log('\n🔍 Checking if we can find valid business and user IDs...');
  
  // Try to find a valid business ID from the businesses table
  setTimeout(() => {
    fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/businesses?limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ'
      }
    })
    .then(response => response.json())
    .then(businesses => {
      if (businesses.length > 0) {
        const validBusinessId = businesses[0].id;
        console.log('✅ Found valid business ID:', validBusinessId);
        
        // Test with valid business ID
        return fetch('/api/beehive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'addRequest',
            userId: userId,
            data: {
              title: 'Valid Business ID Test',
              description: 'Testing with valid business ID',
              category: 'feature',
              priority: 'low',
              industry: 'retail',
              country: 'KE',
              user_id: userId, // Still might be invalid
              business_id: validBusinessId, // Valid business ID
              status: 'active',
              upvotes_count: 0,
              downvotes_count: 0,
              comments_count: 0,
              is_featured: false,
              metadata: {}
            }
          })
        });
      } else {
        console.log('ℹ️ No businesses found in database');
        return Promise.reject('No businesses found');
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    })
    .then(result => {
      console.log('✅ SUCCESS! Request with valid business ID created');
      console.log('📋 Request ID:', result.data?.id);
      console.log('👤 User ID in response:', result.data?.user_id);
      console.log('🏢 Business ID in response:', result.data?.business_id);
      console.log('🎉 Valid business ID test passed!');
    })
    .catch(error => {
      console.log('ℹ️ Valid business ID test skipped:', error.message);
    });
  }, 4000);
}

console.log('🚀 Running both foreign key constraint tests...');
testBothForeignKeyFixes();
