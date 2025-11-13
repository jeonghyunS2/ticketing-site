/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: "./",
  },
  async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "http://172-31-8-172:3001/api/:path*",
    },
    {
      source: "/ping",
      destination: "http://172-31-8-172:3001/ping",
    },
  ];
},

};

export default nextConfig;
