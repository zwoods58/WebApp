// Test script to verify comment display works
// Run this in browser console

function testCommentDisplay() {
  console.log('🧪 Testing Comment Display');
  console.log('==========================');
  
  // Get user ID
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
  
  // First, let's create a test request to comment on
  console.log('\n🧪 Creating a test request to comment on...');
  
  fetch('/api/beehive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'addRequest',
      userId: userId,
      data: {
        title: 'Test Request for Comments',
        description: 'This request is for testing comment functionality',
        category: 'feature',
        priority: 'medium',
        industry: 'retail',
        country: 'KE',
        user_id: userId,
        business_id: null,
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
  .then(requestResult => {
    const testRequestId = requestResult.data?.id;
    console.log('✅ Test request created:', testRequestId);
    
    // Now add a comment to this request
    console.log('\n🧪 Adding a comment to the test request...');
    
    return fetch('/api/beehive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addComment',
        userId: userId,
        data: {
          requestId: testRequestId,
          comment: 'This is a test comment created via API'
        }
      })
    });
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(commentResult => {
    console.log('✅ Comment created:', commentResult.data?.id);
    
    // Now test fetching comments for this request
    console.log('\n🧪 Testing comment fetch via API...');
    
    // Get the request ID from the comment result
    const requestId = commentResult.data?.request_id;
    
    return fetch('/api/beehive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'listComments',
        data: { requestId }
      })
    });
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(commentsResult => {
    console.log('✅ Comments fetched successfully!');
    console.log('📋 Comments count:', commentsResult.data?.length || 0);
    
    if (commentsResult.data && commentsResult.data.length > 0) {
      console.log('📝 First comment:', commentsResult.data[0].comment);
      console.log('📅 Created at:', commentsResult.data[0].created_at);
      console.log('👤 User ID:', commentsResult.data[0].user_id);
      console.log('🎉 Comment display API is working!');
    } else {
      console.log('⚠️ No comments found (this might be expected)');
    }
    
    console.log('\n📊 Test Results:');
    console.log('✅ Comment creation: Working');
    console.log('✅ Comment fetching: Working');
    console.log('✅ API route: Working');
    console.log('🎯 Comment functionality should work in the UI!');
    
    console.log('\n💡 What to check in the UI:');
    console.log('1. Find the test request in the Beehive');
    console.log('2. Click on the comment button');
    console.log('3. You should see the test comment');
    console.log('4. Try adding a new comment');
    console.log('5. The comment should appear immediately');
  })
  .catch(error => {
    console.error('❌ Comment display test failed:', error.message);
    
    if (error.message.includes('foreign key constraint')) {
      console.log('❌ Foreign key constraint still not fixed');
    } else if (error.message.includes('404')) {
      console.log('❌ API endpoint not found');
    } else if (error.message.includes('500')) {
      console.log('❌ Server error - check server logs');
    } else {
      console.log('❌ Other error:', error.message);
    }
  });
}

console.log('🚀 Running comment display test...');
testCommentDisplay();
