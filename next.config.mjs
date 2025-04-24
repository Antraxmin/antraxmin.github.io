/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    domains: ['github.com'],
    unoptimized: true, 
  },
};

export default nextConfig;