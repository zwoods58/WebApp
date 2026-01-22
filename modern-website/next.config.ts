import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
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
    ];
  },
};

export default nextConfig;
