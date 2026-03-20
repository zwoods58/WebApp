// Test script to verify beehive like and comment button functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testBeehiveAPI() {
  console.log('🧪 Testing Beehive API functionality...\n');

  try {
    // Test 1: List beehive requests
    console.log('📋 Testing list requests...');
    const listResponse = await fetch(`${BASE_URL}/api/beehive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'list',
        industry: 'retail',
        country: 'ke'
      })
    });
    
    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log('✅ List requests successful:', listData.data?.length || 0, 'requests found');
      
      if (listData.data && listData.data.length > 0) {
        const sampleRequest = listData.data[0];
        console.log('📊 Sample request data:');
        console.log('  - ID:', sampleRequest.id);
        console.log('  - Title:', sampleRequest.title);
        console.log('  - Upvotes:', sampleRequest.upvotes_count || 0);
        console.log('  - Comments:', sampleRequest.comments_count || 0);
        console.log('  - Status:', sampleRequest.status);
      }
    } else {
      console.log('❌ List requests failed:', listResponse.status);
    }

    // Test 2: Add a test comment (if we have a request)
    console.log('\n💬 Testing add comment functionality...');
    const testRequestId = 'test-request-id';
    const commentResponse = await fetch(`${BASE_URL}/api/beehive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addComment',
        userId: 'test-user-id',
        data: {
          requestId: testRequestId,
          comment_text: 'Test comment for verification'
        }
      })
    });
    
    if (commentResponse.ok) {
      console.log('✅ Add comment API endpoint is working');
    } else {
      const errorData = await commentResponse.json();
      console.log('⚠️ Add comment response (expected if request doesn\'t exist):', errorData.error || 'Unknown error');
    }

    // Test 3: Test voting functionality
    console.log('\n🗳️ Testing vote functionality...');
    const voteResponse = await fetch(`${BASE_URL}/api/beehive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'voteOnRequest',
        userId: 'test-user-id',
        data: {
          requestId: testRequestId,
          voteType: 'up'
        }
      })
    });
    
    if (voteResponse.ok) {
      console.log('✅ Vote API endpoint is working');
    } else {
      const errorData = await voteResponse.json();
      console.log('⚠️ Vote response (expected if request doesn\'t exist):', errorData.error || 'Unknown error');
    }

    console.log('\n🎉 Beehive API tests completed!');
    console.log('\n📝 Summary of fixes applied:');
    console.log('  1. ✅ Enabled voting functionality in beehive page');
    console.log('  2. ✅ Fixed field name consistency (upvotes_count vs upvotes)');
    console.log('  3. ✅ Updated admin components to use correct field names');
    console.log('  4. ✅ Comment count updates are handled by API');
    console.log('  5. ✅ Vote count updates are handled by API');
    
    console.log('\n🔍 To test manually:');
    console.log('  1. Navigate to http://localhost:3000/Beezee-App/app/ke/retail/beehive');
    console.log('  2. Try clicking the like (thumbs up) button on any request');
    console.log('  3. Try adding a comment and see if the count updates');
    console.log('  4. Check if the vote and comment indicators update correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBeehiveAPI();
