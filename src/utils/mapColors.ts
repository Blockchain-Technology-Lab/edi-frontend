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
