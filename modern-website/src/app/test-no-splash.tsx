// Add this temporarily to verify no splash appears
// app/test-no-splash.tsx
export default function TestPage() {
  console.log('Page loaded - no splash screen visible');
  
  return (
    <div style={{ 
      background: '#1e3c72', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1>No Browser Splash ✓</h1>
        <p>The default browser splash has been completely removed</p>
      </div>
    </div>
  );
}

