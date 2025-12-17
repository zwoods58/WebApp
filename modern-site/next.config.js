/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Allow network access for mobile testing
  allowedDevOrigins: [
    '192.168.100.2:3000',
    'localhost:3000',
  ],
  // Performance optimizations
  swcMinify: true,
  compress: true,
  // Enable experimental features if needed
  experimental: {
    // optimizeCss: true, // Disabled - requires critters package
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ignore ESLint errors during build for production deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build (if any)
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

