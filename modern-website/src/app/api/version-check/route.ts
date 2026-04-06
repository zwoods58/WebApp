import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use Vercel deployment info for version tracking
    const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || 'local-dev';
    const gitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
    const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
    
    // Create version string from deployment info
    // Format: v{manifest-version} (clean format to prevent double updates)
    const manifestVersion = '108';  // Increment this with each release
    const shortCommitSha = gitCommitSha.substring(0, 7);
    const version = `v${manifestVersion}`; // Clean format: v108
    const fullVersion = `v${manifestVersion}-${shortCommitSha}`; // Full format with commit
    
    console.log('[Version Check] Returning version:', {
      version,
      fullVersion,
      deploymentId,
      environment,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      version, // Clean format: v107 (prevents double updates)
      fullVersion, // Full format: v107-abc123f (for reference)
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
