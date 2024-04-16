/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'craftsnippets.com',
        port: ''
      }
    ]
  },
}

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: true//process.env.ANALYZE === "false",
// });

//module.exports = withBundleAnalyzer(nextConfig)
module.exports = nextConfig
