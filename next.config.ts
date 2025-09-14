import type { NextConfig } from 'next';
const isGH = process.env.NEXT_PUBLIC_BASE_PATH;
const nextConfig: NextConfig = {
  output: 'export',                  // static export
  images: { unoptimized: true },     // GH Pages friendly
  basePath: isGH || '',              // e.g. '/quiz-app'
  assetPrefix: isGH ? `${isGH}/` : undefined,
  trailingSlash: true,               // safer relative links on GH Pages
};
export default nextConfig;
