/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  experimental: {
    optimizeCss: false,
    serverMinification: false,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://54.65.167.3:3001/api/:path*", // 내부는 이것만 정답
      },
       ];
  },
};

export default nextConfig;
