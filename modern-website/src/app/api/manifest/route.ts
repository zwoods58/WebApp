import { NextRequest, NextResponse } from 'next/server';

// Country-specific PWA configurations
const COUNTRY_CONFIGS = {
  ke: {
    name: 'BeeZee Finance Kenya',
    short_name: 'BeeZee KE',
    description: 'Financial management for Kenyan informal businesses',
    theme_color: '#006600',
    background_color: '#ffffff',
    start_url: '/kenya/app',
    scope: '/kenya/app/',
    icons: [
      {
        src: '/icons/ke-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/ke-icon-512.png', 
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['finance', 'business', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    display: 'standalone',
    orientation: 'portrait'
  },
  za: {
    name: 'BeeZee Finance South Africa',
    short_name: 'BeeZee ZA',
    description: 'Financial management for South African informal businesses',
    theme_color: '#F59E0B',
    background_color: '#ffffff',
    start_url: '/south-africa/app',
    scope: '/south-africa/app/',
    icons: [
      {
        src: '/icons/za-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/za-icon-512.png',
        sizes: '512x512', 
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['finance', 'business', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    display: 'standalone',
    orientation: 'portrait'
  },
  ng: {
    name: 'BeeZee Finance Nigeria',
    short_name: 'BeeZee NG',
    description: 'Financial management for Nigerian informal businesses',
    theme_color: '#008751',
    background_color: '#ffffff',
    start_url: '/nigeria/app',
    scope: '/nigeria/app/',
    icons: [
      {
        src: '/icons/ng-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/ng-icon-512.png',
        sizes: '512x512',
        type: 'image/png', 
        purpose: 'any maskable'
      }
    ],
    categories: ['finance', 'business', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    display: 'standalone',
    orientation: 'portrait'
  }
};

// Detect country from URL
function detectCountryFromUrl(url: string): 'ke' | 'za' | 'ng' | null {
  const pathname = new URL(url).pathname;
  
  if (pathname.startsWith('/kenya')) return 'ke';
  if (pathname.startsWith('/south-africa')) return 'za';
  if (pathname.startsWith('/nigeria')) return 'ng';
  
  return null;
}

// Generate manifest with country overlay icon URL
function generateManifestWithCountry(baseConfig: any, countryCode: string) {
  return {
    ...baseConfig,
    icons: baseConfig.icons.map((icon: any) => ({
      ...icon,
      src: icon.src.replace('/icons/', `/icons/${countryCode}-`)
    }))
  };
}

export async function GET(request: NextRequest) {
  const url = request.url;
  const country = detectCountryFromUrl(url);
  
  // Default to Kenya if no country detected
  const countryCode = country || 'ke';
  const config = COUNTRY_CONFIGS[countryCode];
  
  if (!config) {
    return NextResponse.json(
      { error: 'Country not supported' },
      { status: 404 }
    );
  }

  // Generate manifest with country-specific icons
  const manifest = generateManifestWithCountry(config, countryCode);
  
  // Set appropriate headers
  const response = NextResponse.json(manifest);
  response.headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  response.headers.set('Content-Type', 'application/manifest+json');
  
  return response;
}

// Also serve country-specific service worker registration
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { country } = body;
  
  if (!country || !COUNTRY_CONFIGS[country as keyof typeof COUNTRY_CONFIGS]) {
    return NextResponse.json(
      { error: 'Invalid country' },
      { status: 400 }
    );
  }

  const config = COUNTRY_CONFIGS[country as keyof typeof COUNTRY_CONFIGS];
  
  return NextResponse.json({
    serviceWorkerUrl: `/${country}/app/sw.js`,
    manifestUrl: `/api/manifest?country=${country}`,
    config
  });
}
