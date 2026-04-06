import { NextResponse } from 'next/server';

// Try to import build version if available
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

export async function GET() {
  try {
    // Use Vercel deployment info for version tracking
    const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || 'local-dev';
    const gitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
    const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
    
    let manifestVersion = '108';
    let shortCommitSha;
    let timestamp;
    
    // Use build-generated version if available, otherwise generate at runtime
    if (buildVersion) {
      manifestVersion = buildVersion.manifestVersion;
      shortCommitSha = buildVersion.gitCommitSha;
      timestamp = buildVersion.timestamp;
      console.log('[Version Check] Using build-generated version:', buildVersion);
    } else {
      // Fallback to runtime generation
      manifestVersion = '108';
      shortCommitSha = gitCommitSha.substring(0, 7);
      timestamp = Date.now().toString();
      console.log('[Version Check] Using runtime-generated version');
    }
    
    // Create unique version per deployment
    const version = `v${manifestVersion}-${shortCommitSha}-${timestamp}`;
    const cleanVersion = `v${manifestVersion}`; // For comparison
    
    console.log('[Version Check] Returning dynamic version:', {
      version,
      cleanVersion,
      deploymentId,
      environment,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      version, // Dynamic version: v108-abc123f-1648834567
      cleanVersion, // Clean version: v108
      manifestVersion,
      deploymentId,
      gitCommitSha,
      environment,
      buildTime: new Date().toISOString(),
      forceUpdate: false,  // Can be set to true for critical updates
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('[Version Check] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get version info',
        version: 'v108-error'  // Fallback version
      },
      { status: 500 }
    );
  }
}
