/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  distDir: "dist",
  images: {
    unoptimized: true
  }
}

export default nextConfig
