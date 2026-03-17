// Test script to diagnose authentication and business creation errors
// Run this in browser console

function diagnoseAuthAndBusinessErrors() {
  console.log('🔍 Diagnosing Auth and Business Creation Errors');
  console.log('===============================================');
  
  // Check environment variables
  console.log('\n🌍 Environment Variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
  
  // Check current auth session
  console.log('\n🔐 Current Auth Session:');
  if (typeof window !== 'undefined') {
    // Check localStorage for session data
    const sessionData = localStorage.getItem('sessionData');
    const userProfile = localStorage.getItem('userProfile');
    const beezeeAuth = localStorage.getItem('beezee-auth');
    
    console.log('sessionData:', sessionData ? 'EXISTS' : 'NOT FOUND');
    console.log('userProfile:', userProfile ? 'EXISTS' : 'NOT FOUND');
    console.log('beezee-auth:', beezeeAuth ? 'EXISTS' : 'NOT FOUND');
    
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        console.log('Session user ID:', parsed.userId);
        console.log('Session created:', parsed.created_at);
      } catch (e) {
        console.error('Failed to parse sessionData:', e);
      }
    }
  }
  
  // Test Supabase client
  console.log('\n📡 Testing Supabase Client:');
  
  // Test basic connection
  fetch('/api/health')
    .then(response => response.json())
    .then(data => {
      console.log('✅ API health check:', data);
    })
    .catch(error => {
      console.error('❌ API health check failed:', error);
    });
  
  // Test business creation simulation
  console.log('\n🏢 Testing Business Creation Logic:');
  
  const mockBusinessData = {
    user_id: 'test-user-id',
    industry: 'retail',
    business_name: 'Test Business',
    country: 'KE',
    settings: {
      currency: 'KES',
      daily_target: 5000
    },
    is_active: true
  };
  
  console.log('Mock business data:', mockBusinessData);
  
  // Check if we can create a business via API
  fetch('/api/business/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mockBusinessData)
  })
    .then(response => response.json())
    .then(data => {
      console.log('✅ Business creation API response:', data);
    })
    .catch(error => {
      console.error('❌ Business creation API failed:', error);
    });
  
  // Test authentication refresh
  console.log('\n🔄 Testing Authentication Refresh:');
  
  // Check if there's an active session
  if (typeof window !== 'undefined' && window.supabase) {
    window.supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Get session failed:', error);
        } else if (data.session) {
          console.log('✅ Active session found:', data.session.user.id);
          
          // Test refresh
          window.supabase.auth.refreshSession()
            .then(({ data, error }) => {
              if (error) {
                console.error('❌ Session refresh failed:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
              } else {
                console.log('✅ Session refresh successful');
              }
            });
        } else {
          console.log('ℹ️ No active session found');
        }
      });
  }
  
  // Check for common issues
  console.log('\n🔧 Common Issues Check:');
  
  // Check network connectivity
  if (typeof navigator !== 'undefined') {
    console.log('Online status:', navigator.onLine ? 'ONLINE' : 'OFFLINE');
    
    if (!navigator.onLine) {
      console.error('❌ User is offline - this could cause auth refresh failures');
    }
  }
  
  // Check for CORS issues
  console.log('Current origin:', window.location.origin);
  console.log('Expected Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  // Check for service worker interference
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        console.log('⚠️ Service workers detected - they might interfere with auth');
        console.log('Registrations:', registrations.length);
      } else {
        console.log('✅ No service workers detected');
      }
    });
  }
  
  console.log('\n📊 Summary:');
  console.log('1. Check environment variables are properly set');
  console.log('2. Ensure user has valid authentication session');
  console.log('3. Verify network connectivity');
  console.log('4. Check for CORS or service worker issues');
  console.log('5. Look at detailed error messages in console');
  
  console.log('\n💡 Next Steps:');
  console.log('1. Run this test to see detailed error information');
  console.log('2. Check browser network tab for failed requests');
  console.log('3. Verify Supabase project settings and RLS policies');
  console.log('4. Check if environment variables are loaded correctly');
}

console.log('🚀 Running auth and business error diagnosis...');
diagnoseAuthAndBusinessErrors();
