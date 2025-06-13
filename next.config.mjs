/** @type {import('next').NextConfig} */

/*
 * The dashboard is currently hosted at https://groups.inf.ed.ac.uk/blockchainlab/edi-dashboard/
 * whereas the URL http://blockchainlab.inf.ed.ac.uk/edi-dashboard/ is also pointed at the groups' directory;
 * therefore, we may need to have two different builds based upon the basePath;
 *
 * For Groups' Build:
 * const basePath = `/blockchainlab/edi-dashboard`
 *
 * For BlockchainLab's Build:
 * const basePath = `/edi-dashboard`
 *
 * For localhost Build:
 * comment the line: // const basePath = ""
 *
 * Please make sure the basePath is also updated in the file src/utils/paths.ts
 *
 */

const isDev = process.env.NODE_ENV === "development"

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "dist",
  basePath: "",
  trailingSlash: true,
  images: {
    unoptimized: true
  }, 
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    // Prevent ISR/HMR dev conflict (only in dev)
    isrFlushToDisk: !isDev
  }
}

export default nextConfig
