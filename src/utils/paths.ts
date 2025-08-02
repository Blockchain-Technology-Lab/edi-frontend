import { getImageUrl, getWatermarkUrl } from './images';

export const basePath = ''; //"/blockchainlab/demo";

// Smart image URLs with Cloudinary fallback
export const WATERMARK_BLACK_1X = getWatermarkUrl('black', '1x');
export const WATERMARK_BLACK_2X = getWatermarkUrl('black', '2x');
export const WATERMARK_WHITE_1X = getWatermarkUrl('white', '1x');
export const WATERMARK_WHITE_2X = getWatermarkUrl('white', '2x');

// Update these to use getImageUrl for Cloudinary support
export const LINECHART_WATERMARK_WHITE = getImageUrl(
  '/images/edi-white-watermark.png'
);
export const LINECHART_WATERMARK_BLACK = getImageUrl(
  '/images/edi-black-watermark.png'
);
export const SCREENSHOT_WATERMARK = getImageUrl(
  '/images/edi-black-watermark.png'
);

// Card images - now with Cloudinary support (add cloudinary IDs as you upload)
export const EDI_CARD = getImageUrl('/images/cards/edi.png');
export const CONSENSUS_CARD = getImageUrl('/images/cards/consensus.png');
export const CONSENSUS_OPTIONS = getImageUrl(
  '/images/cards/consensus_options.png'
);
export const TOKENOMICS_CARD = getImageUrl('/images/cards/tokenomics.png');
export const SOFTWARE_CARD = getImageUrl('/images/cards/software.png');
export const NETWORK_CARD = getImageUrl('/images/cards/network.png');
export const GEOGRAPHY_CARD = getImageUrl('/images/cards/geography.png');
export const GOVERNANCE_CARD = getImageUrl('/images/cards/governance.png');
export const HARDWARE_CARD = getImageUrl('/images/cards/hardware.png');
export const CONSENSUS_METHOD_CARD = getImageUrl(
  '/images/methodology/consensus.png'
);
export const TOKENOMICS_METHOD_CARD = getImageUrl(
  '/images/methodology/tokenomics.png'
);
export const DOUGHNUT_CARD = getImageUrl('/images/cards/doughnut.png');
export const ORG_DISTRIBUTOR = getImageUrl('/images/cards/org_distributor.png');
export const COUNTRIES_METRICS = getImageUrl(
  '/images/cards/countries_metrics.png'
);
export const BIP_NETWORK_CARD = getImageUrl(
  '/images/governance/bip_network.png'
);

// CSV paths (these stay the same - no need for Cloudinary)
export const TOKENOMICS_CSV = basePath + '/output/tokenomics/';
export const CONSENSUS_CSV = basePath + '/output/consensus/';
export const SOFTWARE_CSV = basePath + '/output/software/line/';
export const SOFTWARE_DOUGHNUT_CSV = basePath + '/output/software/doughnut/';
export const NETWORK_CSV = basePath + '/output/network/';
export const GEOGRAPHY_CSV = basePath + '/output/geography/';
export const CHANGELOG_JSON = basePath + '/changelog/changes.json';
export const INFOGRAPHICS = basePath + '/infographics/';
export const RADAR_CSV = basePath + '/output/radar_chart.csv';
