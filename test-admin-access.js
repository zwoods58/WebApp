// Test admin page access
async function testAdminAccess() {
  try {
    console.log('Testing admin page access...');
    
    const response = await fetch('https://atarwebb.com/admin');
    
    console.log('Admin page status:', response.status);
    
    if (response.status === 200) {
      const html = await response.text();
      console.log('Admin page accessible');
      
      // Check if it redirects to login
      if (html.includes('login') || html.includes('Login')) {
        console.log('⚠️ Admin page redirects to login (authentication required)');
      } else {
        console.log('✅ Admin page loads without redirect');
      }
    } else if (response.status === 302 || response.status === 307) {
      console.log('⚠️ Admin page redirects (status:', response.status, ')');
    } else {
      console.log('❌ Admin page not accessible:', response.status);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminAccess();


