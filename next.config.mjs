/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "dist",
  basePath: '/blockchainlab/edi-dashboard',
  images: {
    unoptimized: true
  }
}

export default nextConfig
