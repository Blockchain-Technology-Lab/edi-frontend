import { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js'
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale
} from 'chartjs-chart-geo'
import * as topojson from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, FeatureCollection } from 'geojson'
import { GitHubButton } from '@/components'
import Tippy from '@tippyjs/react'
import { Info, ImageDown } from 'lucide-react'
import { useExportChart } from '@/hooks'

// Register chart.js geo components
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale)

interface WorldMapCardProps {
  data: Record<string, number>
  title: string
  description?: string
  loading?: boolean
  githubUrl?: string
  colorScheme?: {
    minColor: string
    maxColor: string
    noDataColor: string
  }
}

interface CountryProperties {
  name: string
}

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection
  }
}

export function WorldMapCard({
  data,
  title,
  description,
  loading = false,
  githubUrl,
  colorScheme = {
    minColor: '#f3e8ff',
    maxColor: '#7c3aed',
    noDataColor: '#e5e7eb'
  }
}: WorldMapCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [error, setError] = useState<string | null>(null)
  const exportChart = useExportChart()

  useEffect(() => {
    if (!chartRef.current || loading) return

    let isMounted = true

    // Fetch world map GeoJSON from local file
    fetch('/world-atlas-110m.json')
      .then((r) => r.json())
      .then((worldData: WorldAtlasTopology) => {
        if (!isMounted) return

        // Convert TopoJSON to GeoJSON
        const countries = topojson.feature(
          worldData,
          worldData.objects.countries
        ) as FeatureCollection

        // Find max value for color scaling
        const maxValue = Math.max(...Object.values(data).filter((v) => v > 0))

        // Map your data to countries with proper typing
        const countryNames: string[] = []
        const chartData = countries.features.map((country: Feature) => {
          const countryName =
            (country.properties as CountryProperties)?.name || 'Unknown'
          countryNames.push(countryName)
          const value = data[countryName] || 0

          return {
            feature: country,
            value: value,
            countryName: countryName
          }
        })

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
                  const value = (
                    context.raw as { value: number; countryName: string }
                  ).value
                  if (value === 0) return colorScheme.noDataColor

                  // Linear interpolation between min and max color
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
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: (context) => {
                    if (context.length > 0) {
                      const countryName = (
                        context[0].raw as { countryName: string }
                      )?.countryName
                      return countryName || 'Unknown Country'
                    }
                    return ''
                  },
                  label: (context) => {
                    const value = (context.raw as { value: number })?.value || 0
                    return `Nodes: ${value.toLocaleString()}`
                  }
                }
              }
            },
            scales: {
              projection: {
                axis: 'x',
                projection: 'equalEarth'
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
  }, [data, loading, colorScheme])

  if (loading) {
    return (
      <div className="card-body m-1">
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="card-body m-1" key={title} title={title}>
      <div className="flex justify-between items-center shadow-lg text-xl card-title bg-base-300 alert w-full mb-4">
        <span>{title}</span>

        <div className="flex gap-2">
          {/* Info button with tooltip if description provided */}
          {description && (
            <Tippy content={description} placement="bottom">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-circle btn-ghost btn-sm text-base-content hover:text-accent"
                aria-label={`Info about "${title}"`}
              >
                <Info size={16} />
              </button>
            </Tippy>
          )}

          {/* GitHub button if URL provided */}
          {githubUrl && <GitHubButton url={githubUrl} />}
        </div>
      </div>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : (
        <div className="card bg-base-300 shadow-lg p-1 space-y-4">
          <div className="aspect-[16/9] mt-2">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
          <div className="text-end">
            <button
              className="btn btn-sm bg-base-100"
              onClick={() =>
                exportChart(
                  chartRef,
                  title.replace(/\s+/g, '-').toLowerCase() + '-map'
                )
              }
              aria-label="Download as PNG"
              title="Download as PNG"
            >
              <ImageDown />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to interpolate between two hex colors
function interpolateColor(
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
