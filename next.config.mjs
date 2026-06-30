/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: "/assets/**" }]
  }
};

export default nextConfig;
