const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me"
      }
    ]
  },
  outputFileTracingRoot: path.resolve(__dirname),
}

module.exports = nextConfig