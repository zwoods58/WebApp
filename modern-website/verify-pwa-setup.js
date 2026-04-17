// PWA Verification Script
// Run this in browser console to verify PWA setup

console.log('=== PWA Setup Verification ===');

// 1. Check service worker registration
navigator.serviceWorker.getRegistration().then(registration => {
  if (registration) {
    console.log('Service Worker Status:');
    console.log('  Active:', registration.active?.state);
    console.log('  Installing:', registration.installing?.state);
    console.log('  Waiting:', registration.waiting?.state);
    console.log('  Script URL:', registration.active?.scriptURL);
    console.log('  Scope:', registration.scope);
  } else {
    console.log('No service worker registration found');
  }
}).catch(err => {
  console.error('Service Worker Error:', err);
});

// 2. Check PWA features
console.log('\nPWA Features:');
console.log('  Service Worker Support:', 'serviceWorker' in navigator);
console.log('  Cache Support:', 'caches' in window);
console.log('  Background Sync Support:', 'serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype);
console.log('  Online Status:', navigator.onLine);

// 3. Check cache names
caches.keys().then(keys => {
  console.log('\nCache Names:', keys);
});

// 4. Test offline functionality
console.log('\nOffline Test:');
console.log('  Try going offline in DevTools and refresh');
console.log('  You should see custom offline.html, not browser error');

// 5. Check headers (network tab)
console.log('\nHeaders Check:');
console.log('  Open DevTools > Network > sw.js');
console.log('  Should see: Cache-Control: no-cache, no-store, must-revalidate');
console.log('  Open DevTools > Network > offline.html');
console.log('  Should see: Cache-Control: no-cache');

console.log('\n=== Verification Complete ===');
