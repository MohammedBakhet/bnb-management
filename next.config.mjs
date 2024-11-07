/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // Explicitly define JWT_SECRET here
  },
};

export default nextConfig;
