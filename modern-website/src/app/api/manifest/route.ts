import { NextRequest, NextResponse } from 'next/server';

// Try to import build version if available (same as version-check)
interface BuildVersion {
  version: string;
  cleanVersion: string;
  manifestVersion: string;
  gitCommitSha: string;
  buildTime: string;
  timestamp: string;
}

let buildVersion: BuildVersion | null = null;
try {
  buildVersion = require('@/lib/build-version.json') as BuildVersion;
} catch (error) {
  // Build version file not available, use runtime generation
}

// Get version using same logic as /api/version-check
function getVersion() {
  try {
    // Use Vercel deployment info for version tracking
    const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || 'local-dev';
    const gitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
    const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
    
    let manifestVersion = '111'; // Updated to match current manifest version
    let shortCommitSha;
    let timestamp;
    
    // Use build-generated version if available, otherwise generate at runtime
    if (buildVersion) {
      manifestVersion = buildVersion.manifestVersion;
      shortCommitSha = buildVersion.gitCommitSha;
      timestamp = buildVersion.timestamp;
      console.log('[Manifest API] Using build-generated version:', buildVersion);
    } else {
      // Fallback to runtime generation
      manifestVersion = '111'; // Match current manifest version
      shortCommitSha = gitCommitSha.substring(0, 7);
      timestamp = Date.now().toString();
      console.log('[Manifest API] Using runtime-generated version');
    }
    
    // Create unique version per deployment
    const version = `v${manifestVersion}-${shortCommitSha}-${timestamp}`;
    const cleanVersion = `v${manifestVersion}`; // For comparison
    
    console.log('[Manifest API] Returning dynamic version:', {
      version,
      cleanVersion,
      deploymentId,
      environment,
      timestamp: new Date().toISOString()
    });
    
    return {
      version,
      cleanVersion,
      manifestVersion,
      deploymentId,
      gitCommitSha,
      environment,
      buildTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Manifest API] Error:', error);
    return {
      version: 'v111-error',
      cleanVersion: 'v111',
      manifestVersion: '111',
      deploymentId: 'error',
      gitCommitSha: 'unknown',
      environment: 'error',
      buildTime: new Date().toISOString()
    };
  }
}

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

  // Get dynamic version using same logic as /api/version-check
  const versionInfo = getVersion();

  // Generate manifest with country-specific icons and dynamic version
  const manifest = {
    ...generateManifestWithCountry(config, countryCode),
    version: versionInfo.version, // Dynamic version from Vercel environment
    // Add version metadata for debugging
    version_metadata: {
      cleanVersion: versionInfo.cleanVersion,
      deploymentId: versionInfo.deploymentId,
      gitCommitSha: versionInfo.gitCommitSha,
      environment: versionInfo.environment,
      buildTime: versionInfo.buildTime
    }
  };
  
  console.log('[Manifest API] Serving manifest with dynamic version:', {
    version: manifest.version,
    country: countryCode,
    deploymentId: versionInfo.deploymentId
  });
  
  // Set appropriate headers with no-cache to ensure fresh versions
  const response = NextResponse.json(manifest);
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
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
