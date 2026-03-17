// Test script to identify what's causing auto-refresh
// Run this in browser console

function debugAutoRefresh() {
  console.log('🔍 Debugging Auto-Refresh Issue');
  console.log('==================================');
  
  // Check current page
  console.log('📍 Current page:', window.location.pathname);
  
  // Check for any intervals running
  console.log('\n⏰ Checking for running intervals...');
  const originalSetInterval = window.setInterval;
  const originalClearInterval = window.clearInterval;
  const intervals = new Set();
  
  // Monitor setInterval calls
  window.setInterval = function(...args) {
    const id = originalSetInterval.apply(this, args);
    intervals.add(id);
    console.log('🔔 setInterval created:', id, 'Delay:', args[1], 'Stack:', new Error().stack);
    return id;
  };
  
  window.clearInterval = function(...args) {
    intervals.delete(args[0]);
    return originalClearInterval.apply(this, args);
  };
  
  // Check for any setTimeout calls that might be causing refresh
  console.log('\n⏱️ Checking for setTimeout calls...');
  const originalSetTimeout = window.setTimeout;
  const timeouts = new Set();
  
  window.setTimeout = function(...args) {
    const id = originalSetTimeout.apply(this, args);
    timeouts.add(id);
    if (args[1] < 10000) { // Only log timeouts less than 10 seconds
      console.log('⚡ setTimeout created:', id, 'Delay:', args[1]);
    }
    return id;
  };
  
  // Check for router.refresh calls
  console.log('\n🔄 Monitoring router.refresh calls...');
  let refreshCount = 0;
  
  // Monitor fetch calls that might trigger refresh
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string') {
      if (url.includes('/api/') || url.includes('supabase')) {
        console.log('🌐 API call:', url);
      }
    }
    return originalFetch.apply(this, args);
  };
  
  // Check for any event listeners that might trigger refresh
  console.log('\n📡 Checking for event listeners...');
  
  // Monitor scroll events
  let scrollCount = 0;
  window.addEventListener('scroll', () => {
    scrollCount++;
    if (scrollCount % 10 === 0) {
      console.log('📜 Scroll events detected:', scrollCount);
    }
  });
  
  // Monitor visibility changes
  document.addEventListener('visibilitychange', () => {
    console.log('👁️ Visibility changed:', document.hidden);
  });
  
  // Check for any custom refresh events
  window.addEventListener('globalDataRefresh', (e) => {
    console.log('🔄 Global data refresh event:', e.detail);
    refreshCount++;
  });
  
  // Check localStorage changes
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(...args) {
    if (args[0].includes('auth') || args[0].includes('session')) {
      console.log('💾 Auth localStorage changed:', args[0]);
    }
    return originalSetItem.apply(this, args);
  };
  
  console.log('\n📊 Current state:');
  console.log('✅ Monitoring started');
  console.log('🔍 Watch console for any of the following:');
  console.log('  - setInterval calls (especially with short delays)');
  console.log('  - API calls to /api/ or supabase');
  console.log('  - Router refresh calls');
  console.log('  - Global data refresh events');
  console.log('  - Auth localStorage changes');
  
  console.log('\n💡 To stop monitoring, refresh the page');
  
  // Report current intervals
  setTimeout(() => {
    console.log('\n📈 Initial check after 2 seconds...');
    console.log('🔔 Active intervals:', intervals.size);
    console.log('⚡ Active timeouts:', timeouts.size);
    console.log('🔄 Refresh events:', refreshCount);
  }, 2000);
  
  // Report after 10 seconds
  setTimeout(() => {
    console.log('\n📈 Check after 10 seconds...');
    console.log('🔔 Active intervals:', intervals.size);
    console.log('⚡ Active timeouts:', timeouts.size);
    console.log('🔄 Refresh events:', refreshCount);
    
    if (intervals.size > 5) {
      console.log('⚠️ Too many intervals running! This could cause auto-refresh');
    }
    
    if (refreshCount > 0) {
      console.log('⚠️ Refresh events detected! This is causing the auto-refresh');
    }
  }, 10000);
}

console.log('🚀 Starting auto-refresh debug...');
debugAutoRefresh();
