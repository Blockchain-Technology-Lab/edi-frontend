/**
 * Utility functions for world map color handling
 */

/**
 * Linearly interpolate between two hex colors
 * @param color1 - Start color in hex format (e.g., '#ffffff')
 * @param color2 - End color in hex format
 * @param ratio - Interpolation ratio (0 to 1)
 * @returns RGB color string
 */
export function interpolateColor(
  color1: string,
  color2: string,
  ratio: number
): string {
  const hex = (color: string) => {
    const c = color.replace('#', '')
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16)
    }
  }

  const c1 = hex(color1)
  const c2 = hex(color2)

  const r = Math.round(c1.r + (c2.r - c1.r) * ratio)
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio)
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Default color scheme for world maps
 */
export const DEFAULT_MAP_COLOR_SCHEME = {
  minColor: '#f3e8ff',
  maxColor: '#7c3aed',
  noDataColor: '#e5e7eb'
}

/**
 * Convert rgba color to hex
 */
function rgbaToHex(rgba: string): string {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return '#7c3aed' // fallback

  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])

  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

/**
 * Create a color scheme from a ledger's brand color
 * Generates a light version for min and uses the brand color for max
 */
export function createColorSchemeFromLedgerColor(
  ledgerColor: string
): typeof DEFAULT_MAP_COLOR_SCHEME {
  const maxColor = rgbaToHex(ledgerColor)

  // Extract RGB values from the max color
  const hex = maxColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Create a lighter version by mixing with white (increase RGB values)
  const lightR = Math.round(r + (255 - r) * 0.85)
  const lightG = Math.round(g + (255 - g) * 0.85)
  const lightB = Math.round(b + (255 - b) * 0.85)

  const minColor = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`

  return {
    minColor,
    maxColor,
    noDataColor: '#e5e7eb'
  }
}
