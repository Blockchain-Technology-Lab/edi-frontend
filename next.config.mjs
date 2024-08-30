/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "dist",
//  basePath: '/blockchainlab/edi-dashboard', /* Use basePath for building for either groups or blockchainlab URLs */

  images: {
    unoptimized: true
  }
}

export default nextConfig
