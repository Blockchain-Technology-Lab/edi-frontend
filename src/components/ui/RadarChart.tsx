import { useRef, useState, useContext, useMemo, useEffect } from 'react'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Scale, Coins, Network, Code, Globe } from 'lucide-react'

import { ImageDown } from 'lucide-react'
import { ThemeContext } from '@/contexts'
import { useExportChart } from '@/hooks'
import type { RadarDataPoint } from '@/hooks/useRadarCsv'
import {
  transformRadarDataWithSegments,
  getRadarChartOptions,
  LINECHART_WATERMARK_WHITE,
  LINECHART_WATERMARK_BLACK
} from '@/utils'
import { ProtocolToggleGroup } from './ProtocolToggleGroup'
import { AccordionGroup } from './AccordionGroup'
import { useNavigate } from '@tanstack/react-router'

import {
  consensusRoute,
  tokenomicsRoute,
  networkRoute,
  softwareRoute,
  geographyRoute
} from '@/router'

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  data: RadarDataPoint[]
  title?: string
  description?: string
  height?: number
  showExport?: boolean
  showLegendToggle?: boolean
  showTooltip?: boolean
  className?: string
}

export function RadarChart({
  data,
  title = 'Protocol Decentralisation Comparison',
  description = '',
  //height = 500,
  showExport = true,
  className = ''
}: RadarChartProps) {
  const { theme: resolvedTheme } = useContext(ThemeContext)
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const exportChart = useExportChart()
  const [visibleDatasets, setVisibleDatasets] = useState<Set<number>>(
    new Set(Array.from({ length: data.length }, (_, i) => i))
  )
  const [tooltipEnabled, setTooltipEnabled] = useState(false)
  const [recentlyClickedDataset, setRecentlyClickedDataset] = useState<
    number | null
  >(null)
  const [hoveredDatasetIndex, setHoveredDatasetIndex] = useState<number | null>(
    null
  )

  // Use the segmented transform so datasets include _missingIndices for the
  // radarMissingSpokes plugin to draw dashed centre→axis spokes.
  const chartData = transformRadarDataWithSegments(data)

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    setTooltipEnabled(!isMobile) // enable tooltips by default if not mobile
  }, [])

  // Filter datasets based on visibility
  const filteredChartData = {
    ...chartData,
    datasets: chartData.datasets
      .filter((_, index) => visibleDatasets.has(index))
      .map((dataset, idx) => {
        // Apply hover effect to the hovered dataset
        if (hoveredDatasetIndex !== null) {
          // Find the original index of this dataset
          let originalIndex = 0
          let count = 0
          for (let i = 0; i < chartData.datasets.length; i++) {
            if (visibleDatasets.has(i)) {
              if (count === idx) {
                originalIndex = i
                break
              }
              count++
            }
          }

          if (originalIndex === hoveredDatasetIndex) {
            return {
              ...dataset,
              borderWidth:
                (dataset.borderWidth as number | number[]) instanceof Array
                  ? (dataset.borderWidth as number[]).map(
                      (w) => (w as number) + 2
                    )
                  : ((dataset.borderWidth as number) || 2) + 2,
              opacity: 1
            }
          } else {
            return {
              ...dataset,
              opacity: 0.3
            }
          }
        }
        return dataset
      })
  }

  const options = useMemo(() => {
    if (resolvedTheme) {
      const baseOptions = getRadarChartOptions(
        resolvedTheme === 'dim' ? 'dark' : 'light'
      )
      return {
        ...baseOptions,
        // expose the full (unfiltered) datasets to the tooltip callbacks
        _allDatasets: chartData.datasets,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            ...baseOptions.plugins?.tooltip,
            enabled: tooltipEnabled
          },
          legend: {
            ...baseOptions.plugins?.legend,
            onClick: (e: any) => {
              // Get the index of the clicked legend item
              const index = e.datasetIndex
              if (index !== undefined) {
                handleDatasetToggle(index)
              }
            }
          }
        }
      }
    }
  }, [resolvedTheme, tooltipEnabled, hoveredDatasetIndex])

  const handleDatasetToggle = (index: number) => {
    const newVisibleDatasets = new Set(visibleDatasets)
    if (newVisibleDatasets.has(index)) {
      newVisibleDatasets.delete(index)
    } else {
      newVisibleDatasets.add(index)
    }
    setVisibleDatasets(newVisibleDatasets)

    // Show visual feedback for legend click
    setRecentlyClickedDataset(index)
    setTimeout(() => setRecentlyClickedDataset(null), 500)
  }

  const handleExport = () => {
    exportChart(chartRef, title.toLowerCase().replace(/\s+/g, '-'), {
      watermarkSrc: watermarkSrc,
      watermarkSize: 60,
      watermarkOpacity: 0.1
    })
  }

  const watermarkSrc =
    resolvedTheme === 'dim'
      ? LINECHART_WATERMARK_WHITE
      : LINECHART_WATERMARK_BLACK

  if (!data || data.length === 0) {
    return <RadarChartSkeleton className={className} />
  }

  if (!options) return null
  const navigate = useNavigate()

  const EDI_LAYERS = [
    {
      name: 'Consensus',
      description: (
        <>
          Measures the decentralisation of consensus participants (block
          producers). The metric used in the Decentralisation Compass is the
          Herfindahl-Hirschman Index (HHI), inverted and scaled. For broader
          comparisons across systems, metrics, and timeframes, see{' '}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => navigate({ to: consensusRoute.to })}
          >
            Consensus
          </span>
          .
        </>
      ),
      details: [
        'Validator/miner distribution',
        'Voting power concentration',
        'Consensus participation rates',
        'Block production diversity'
      ],
      color: '#3B82F6',
      icon: Scale
    },
    {
      name: 'Tokenomics',
      description: (
        <>
          Measures the decentralisation of native asset (token) ownership. The
          metric used in the Decentralisation Compass is the 3-concentration
          ratio, inverted and scaled. For broader comparisons across systems,
          metrics, and timeframes, see{' '}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => navigate({ to: tokenomicsRoute.to })}
          >
            Tokenomics
          </span>
          .
        </>
      ),
      details: [
        'Token distribution fairness',
        'Wealth concentration metrics',
        'Economic incentive alignment',
        'Staking participation'
      ],
      color: '#10B981',
      icon: Coins
    },
    {
      name: 'Software',
      description: (
        <>
          Measures the decentralisation of contributors to full node software
          implementations. The metric used in the Decentralisation Compass is
          the Herfindahl-Hirschman Index (HHI), inverted and scaled. For broader
          comparisons across systems, metrics, and timeframes, see{' '}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => navigate({ to: softwareRoute.to })}
          >
            Software
          </span>
          .
        </>
      ),
      details: [
        'Developer contribution diversity',
        'Code repository distribution',
        'Implementation varieties',
        'Development governance'
      ],
      color: '#F59E0B',
      icon: Code
    },
    {
      name: 'Network',
      description: (
        <>
          Measures the decentralisation of organisations operating a network's
          full nodes. Note that for the case of Ethereum, this specifically
          refers to Execution Layer nodes. The metric used in the
          Decentralisation Compass is the Herfindahl-Hirschman Index (HHI),
          inverted and scaled. For broader comparisons across systems, metrics,
          and timeframes, see{' '}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => navigate({ to: networkRoute.to })}
          >
            Network
          </span>
          .
        </>
      ),
      details: [
        'Node geographical spread',
        'Infrastructure diversity',
        'Network resilience',
        'Operational independence'
      ],
      color: '#EF4444',
      icon: Network
    },
    {
      name: 'Geography',
      description: (
        <>
          Measures the decentralisation of countries where full nodes are
          located. Note that for the case of Ethereum, this specifically refers
          to Execution Layer nodes. The metric shown in the Decentralisation
          Compass is the Herfindahl-Hirschman Index (HHI), inverted and scaled.
          For broader comparisons across systems, metrics, and timeframes, see{' '}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => navigate({ to: geographyRoute.to })}
          >
            Geography
          </span>
          .
        </>
      ),
      details: [
        'Global participant spread',
        'Regional concentration risks',
        'Regulatory jurisdiction diversity',
        'Physical infrastructure distribution'
      ],
      color: '#8B5CF6',
      icon: Globe
    }
  ]

  return (
    <div className={`card bg-base-200 shadow-lg ${className}`}>
      <div className="card-body p-3 sm:p-6">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <h3 className="card-title text-lg sm:text-xl font-bold">{title}</h3>

            <div className="flex items-center gap-2">
              {/* Export Button */}
              {showExport && (
                <button
                  className="btn btn-xs sm:btn-sm btn-ghost"
                  onClick={handleExport}
                  aria-label="Download chart as PNG"
                  title="Download as PNG"
                >
                  <ImageDown size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Description directly under title */}
          {description && (
            <p className="text-base-content/70 text-xs sm:text-sm mt-2">
              {description}
            </p>
          )}
        </div>

        {/* System Selection Toggle - iPhone Style Toggle Switches */}
        <ProtocolToggleGroup
          items={data}
          selectedIndices={visibleDatasets}
          onChange={handleDatasetToggle}
          recentlyClickedIndex={recentlyClickedDataset}
          onHoverChange={setHoveredDatasetIndex}
        />

        {/* Chart Container - Split Layout */}
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 relative">
          {/* Left Side - Chart (2/3 width on desktop, full on mobile) */}
          <div
            className="w-full lg:w-2/3 relative"
            style={{ height: 'clamp(300px, 60vh, 500px)' }}
          >
            <Radar
              data={filteredChartData}
              options={options}
              ref={(ref) => {
                if (ref) {
                  chartRef.current = ref.canvas
                }
              }}
            />

            {/* Watermark Image - Ultra Responsive */}
            <img
              src={watermarkSrc}
              alt="Edinburgh Decentralisation Index"
              className="absolute top-1 left-1 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6 opacity-10 pointer-events-none select-none z-10"
              style={{
                width: 'clamp(40px, 8vw, 120px)',
                height: 'clamp(40px, 8vw, 120px)',
                objectFit: 'contain',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              draggable={false}
            />
          </div>

          {/* Right Side - Information Panel (1/3 width on desktop, full on mobile) */}
          <div className="w-full lg:w-1/3 bg-base-200 rounded-lg p-3 sm:p-4">
            <AccordionGroup
              items={EDI_LAYERS.map((layer) => ({
                id: layer.name,
                title: layer.name,
                content: layer.description,
                icon: layer.icon
              }))}
              label="Description per layer"
            />
          </div>
        </div>

        {/* Tooltip Toggle - Always Visible */}
        <div className="flex items-center gap-2 mt-3 sm:mt-4">
          <input
            type="checkbox"
            checked={tooltipEnabled}
            onChange={() => setTooltipEnabled((v) => !v)}
            id="toggle-tooltip"
            className="checkbox checkbox-xs sm:checkbox-sm"
          />
          <label
            htmlFor="toggle-tooltip"
            className="text-xs sm:text-sm cursor-pointer"
          >
            Show Tooltip
          </label>
        </div>
      </div>
    </div>
  )
}

function RadarChartSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card bg-base-300 shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-base-content/60">Loading radar chart data...</p>
        </div>
      </div>
    </div>
  )
}
