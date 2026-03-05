import { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js'
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale
} from 'chartjs-chart-geo'
import zoomPlugin from 'chartjs-plugin-zoom'
import * as topojson from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, FeatureCollection } from 'geojson'
import { WORLD_MAP_JSON } from '@/utils/paths'
import { interpolateColor, DEFAULT_MAP_COLOR_SCHEME } from '@/utils/mapColors'

Chart.register(
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
  zoomPlugin
)

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection
  }
}

interface CountryProperties {
  name: string
}

interface ChartCountryData {
  feature: Feature
  value: number
  countryName: string
}

interface UseWorldMapChartProps {
  mapData: Record<string, number>
  mapDataBreakdown?: Record<string, Record<string, number>>
  isLoading: boolean
  colorScheme?: typeof DEFAULT_MAP_COLOR_SCHEME
  onTooltipLabel?: (
    countryName: string,
    breakdown?: Record<string, number>
  ) => string | string[]
}

/**
 * Hook that handles world map chart creation and lifecycle
 * Manages the Chart.js choropleth map instance
 */
export function useWorldMapChart({
  mapData,
  mapDataBreakdown,
  isLoading,
  colorScheme = DEFAULT_MAP_COLOR_SCHEME,
  onTooltipLabel
}: UseWorldMapChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (
      !chartRef.current ||
      isLoading ||
      !mapData ||
      Object.keys(mapData).length === 0
    ) {
      return
    }

    let isMounted = true

    fetch(WORLD_MAP_JSON)
      .then((r) => r.json())
      .then((worldData: WorldAtlasTopology) => {
        if (!isMounted) return

        const countries = topojson.feature(
          worldData,
          worldData.objects.countries
        ) as FeatureCollection

        const values = Object.values(mapData).filter((v) => v > 0)
        const maxValue = Math.max(...values)
        const minValue = Math.min(...values)

        const countryNames: string[] = []
        const chartData: ChartCountryData[] = countries.features.map(
          (country: Feature) => {
            const countryName =
              (country.properties as CountryProperties)?.name || 'Unknown'
            countryNames.push(countryName)
            const value = mapData[countryName] || 0

            return {
              feature: country,
              value: value,
              countryName: countryName
            }
          }
        )

        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        if (!chartRef.current) return

        chartInstance.current = new Chart(chartRef.current, {
          type: 'choropleth',
          data: {
            labels: countryNames,
            datasets: [
              {
                label: 'Nodes',
                data: chartData,
                backgroundColor: (context) => {
                  if (!context.raw) return colorScheme.noDataColor
                  const value = (context.raw as { value: number }).value
                  if (value === 0) return colorScheme.noDataColor

                  const ratio = value / maxValue
                  return interpolateColor(
                    colorScheme.minColor,
                    colorScheme.maxColor,
                    ratio
                  )
                }
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            showOutline: true,
            showGraticule: false,
            interaction: {
              mode: 'nearest',
              intersect: false
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                  title: (tooltipItems) => {
                    if (!tooltipItems || tooltipItems.length === 0) return ''
                    const raw = tooltipItems[0].raw as {
                      countryName?: string
                    }
                    return raw?.countryName || 'Unknown Country'
                  },
                  label: (tooltipItem) => {
                    const raw = tooltipItem.raw as {
                      countryName?: string
                      value?: number
                    }
                    const countryName = raw?.countryName
                    const value = raw?.value || 0

                    // Use custom tooltip callback if provided
                    if (onTooltipLabel && countryName) {
                      // For breakdown tooltips, pass the actual breakdown data
                      // For simple tooltips, pass value reconstructed as a single-item breakdown
                      const breakdown = mapDataBreakdown?.[countryName] || {
                        nodes: value
                      }
                      return onTooltipLabel(countryName, breakdown)
                    }

                    // Fallback to simple total display
                    return `Total Nodes: ${value.toLocaleString()}`
                  }
                }
              },
              zoom: {
                pan: {
                  enabled: true,
                  mode: 'xy'
                },
                zoom: {
                  wheel: {
                    enabled: true,
                    speed: 0.1
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'xy'
                },
                limits: {
                  x: { min: -200, max: 200 },
                  y: { min: -200, max: 200 }
                }
              }
            },
            scales: {
              projection: {
                axis: 'x',
                projection: 'equalEarth'
              },
              color: {
                axis: 'x',
                quantize: 5,
                min: minValue,
                max: maxValue,
                legend: {
                  position: 'bottom-right',
                  align: 'bottom'
                },
                missing: colorScheme.noDataColor,
                interpolate: (normalizedValue: number) => {
                  return interpolateColor(
                    colorScheme.minColor,
                    colorScheme.maxColor,
                    normalizedValue
                  )
                }
              }
            }
          }
        })

        setError(null)
      })
      .catch((err) => {
        console.error('Error loading world map:', err)
        setError('Failed to load world map data')
      })

    return () => {
      isMounted = false
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [mapData, mapDataBreakdown, isLoading, colorScheme, onTooltipLabel])

  return { chartRef, error }
}
