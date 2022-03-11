/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["pbs.twimg.com", "gateway.ipfs.io"],
  },
};

module.exports = nextConfig;
