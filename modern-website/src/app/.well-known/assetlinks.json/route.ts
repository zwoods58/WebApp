import { NextResponse } from 'next/server';

/**
 * GET /.well-known/assetlinks.json
 * Android Digital Asset Links for Trusted Web Activity (TWA)
 * This allows the Android app to verify ownership of the web domain
 */
export async function GET() {
  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'web',
        site: 'https://beezee.app'
      }
    },
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.beezee.app',
        sha256_cert_fingerprints: [
          // Replace with your actual SHA-256 fingerprint from your Android app signing key
          // Get this by running: keytool -list -v -keystore your-keystore.jks
          'PLACEHOLDER_SHA256_FINGERPRINT'
        ]
      }
    }
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
