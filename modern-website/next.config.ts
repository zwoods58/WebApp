import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json',
  },
  
  // Enhanced service worker and PWA support
  async headers() {
    return [
      // CORS headers for API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? process.env.NEXT_PUBLIC_SITE_URL || 'https://web-app1-dsvkfjaqz-zwoods58s-projects.vercel.app'
              : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/offline.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      // PWA icons and assets
      {
        source: '/beezee-icon-(.*).png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  async rewrites() {
    return [
      // Serve PWA static files from public directory
      {
        source: '/kenya/app/:path*',
        destination: '/kenya/app/:path*',
      },
      {
        source: '/south-africa/app/:path*',
        destination: '/south-africa/app/:path*',
      },
      {
        source: '/nigeria/app/:path*',
        destination: '/nigeria/app/:path*',
      },
      // Ensure service worker is accessible from all paths
      {
        source: '/Beezee-App/sw.js',
        destination: '/sw.js',
      },
    ];
  },
  
  // Enable experimental features for better PWA support
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Optimize for service worker caching
  compress: true,
  poweredByHeader: false,
  
  // Ensure proper handling of service worker scope
  generateEtags: false,
  
  // Static optimization for better offline performance
  trailingSlash: false,
};

export default nextConfig;
