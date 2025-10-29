import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // eslint: {
  //   // This allows production builds to successfully complete
  //   // even if your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    // This allows production builds to successfully complete
    // even if your project has type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    
  }
};

export default withNextIntl(nextConfig);
