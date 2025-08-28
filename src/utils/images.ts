import { basePath } from "./paths"

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "edi-dashboard"
export const USE_CLOUDINARY = import.meta.env.VITE_USE_CLOUDINARY === "true"

// Image transformation options
export interface CloudinaryOptions {
  width?: number
  height?: number
  quality?: number
  format?: "auto" | "webp" | "avif" | "jpg" | "png"
  crop?: "scale" | "fit" | "fill" | "crop" | "pad"
}

// Mapping of local paths to Cloudinary public IDs (with extensions)
const CLOUDINARY_IMAGE_MAP: Record<string, string> = {
  "/images/edi-black-1x.png": "edi-black-1x.png",
  "/images/edi-black-2x.png": "edi-black-2x.png",
  "/images/edi-white-1x.png": "edi-white-1x.png",
  "/images/edi-white-2x.png": "edi-white-2x.png",
  "/images/cards/consensus.png": "consensus.png",
  "/images/cards/consensus_options.png": "consensus_options.png",
  "/images/cards/tokenomics.png": "tokenomics.png",
  "/images/cards/software.png": "software.png",
  "/images/cards/network.png": "network.png",
  "/images/cards/geography.png": "geography.png",
  "/images/cards/governance.png": "governance.png",
  "/images/cards/hardware.png": "hardware.png",
  "/images/methodology/consensus.png": "methodology-consensus.png",
  "/images/methodology/tokenomics.png": "methodology-tokenomics.png",
  "/images/cards/doughnut.png": "doughnut.png",
  "/images/cards/org_distributor.png": "org_distributor.png",
  "/images/cards/countries_metrics.png": "countries_metrics.png",
  "/images/governance/bip_network.png": "bip_network.png"
}

// Generate Cloudinary URL
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "scale"
  } = options

  const transformations: string[] = [`q_${quality}`, `f_${format}`]

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (width || height) transformations.push(`c_${crop}`)

  const transformString = transformations.join(",")

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`
}

// Main function: get image URL with Cloudinary fallback
export function getImageUrl(
  localPath: string,
  cloudinaryId?: string,
  options: CloudinaryOptions = {}
): string {
  // Use provided cloudinaryId or look it up in the map
  const publicId = cloudinaryId || CLOUDINARY_IMAGE_MAP[localPath]

  // If Cloudinary is enabled and we have a public ID
  if (USE_CLOUDINARY && CLOUDINARY_CLOUD_NAME && publicId) {
    return getCloudinaryUrl(publicId, options)
  }

  // Fallback to local images
  return basePath + localPath
}

// Helper function for watermarks
export function getWatermarkUrl(
  type: "black" | "white",
  resolution: "1x" | "2x",
  options: CloudinaryOptions = {}
): string {
  const localPath = `/images/edi-${type}-${resolution}.png`
  return getImageUrl(localPath, undefined, options)
}
