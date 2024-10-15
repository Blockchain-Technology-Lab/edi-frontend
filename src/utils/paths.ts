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
 * const basePath = ""
 *
 * Please make sure the basePath is also updated in the file next.config.mjs
 */

const basePath = ""

export const WATERMARK_BLACK_1X = basePath + "/images/edi-black-1x.png"

export const WATERMARK_BLACK_2X = basePath + "/images/edi-black-2x.png"

export const WATERMARK_WHITE_1X = basePath + "/images/edi-white-1x.png"

export const WATERMARK_WHITE_2x = basePath + "/images/edi-white-2x.png"

export const LINECHART_WATERMARK_WHITE =
  basePath + "/images/edi-white-watermark.png"

export const LINECHART_WATERMARK_BLACK =
  basePath + "/images/edi-black-watermark.png"

export const TOKENOMICS_CSV = basePath + "/output/tokenomics/"

export const CONSENSUS_CSV = basePath + "/output/consensus/"

export const SOFTWARE_CSV = basePath + "/output/software/line/"

export const SOFTWARE_DOUGHNUT_CSV = basePath + "/output/software/doughnut/"

export const SCREENSHOT_WATERMARK = basePath + "/images/edi-black-watermark.png"
