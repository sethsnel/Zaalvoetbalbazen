/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com', 'googleusercontent.com', 'craftsnippets.com'],
  },
}

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: true//process.env.ANALYZE === "false",
// });

//module.exports = withBundleAnalyzer(nextConfig)
module.exports = nextConfig
