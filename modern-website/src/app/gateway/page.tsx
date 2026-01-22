'use client';

import { useRouter } from 'next/navigation';

export default function CountryGateway() {
  const router = useRouter();

  const handleCountryRedirect = (countryCode: string) => {
    switch (countryCode) {
      case 'KE':
        router.push('/kenya/app');
        break;
      case 'ZA':
        router.push('/south-africa/app');
        break;
      case 'NG':
        router.push('/nigeria/app');
        break;
      default:
        router.push('/kenya/app'); // Default to Kenya
        break;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white'
      }}>
        <h2 style={{ 
          marginBottom: '20px', 
          color: '#1f2937', 
          textAlign: 'center'
        }}>
          BeeZee Finance - Select Your Country
        </h2>
        
        <p style={{ marginBottom: '30px', textAlign: 'center', color: '#6b7280' }}>
          Choose your country to access the localized version of BeeZee Finance tailored for your market.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={() => handleCountryRedirect('KE')}
            style={{
              padding: '20px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1)';
            }}
          >
            🇰🇪 Kenya
          </button>
          
          <button
            onClick={() => handleCountryRedirect('ZA')}
            style={{
              padding: '20px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1)';
            }}
          >
            🇿🇦 South Africa
          </button>
          
          <button
            onClick={() => handleCountryRedirect('NG')}
            style={{
              padding: '20px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'scale(1)';
            }}
          >
            🇳🇬 Nigeria
          </button>
        </div>
        
        <p style={{ marginTop: '30px', fontSize: '14px', color: '#6b7280' }}>
          Each country has its own currency, language, and features optimized for local businesses.
        </p>
      </div>
    </div>
  );
}
