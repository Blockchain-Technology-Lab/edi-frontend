import {
  useRef,
  useState,
  useContext,
  useMemo,
  useCallback
} from 'react'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  type ChartEvent,
  type LegendItem,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCubes,
  faCoins,
  faNetworkWired,
  faCode,
  faGlobe,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// Wraps an FA IconDefinition as a ComponentType compatible with AccordionGroup
function faIcon(icon: IconDefinition) {
  return function FAIcon({
    className,
    style
  }: {
    size?: number
    className?: string
    style?: React.CSSProperties
  }) {
    return (
      <FontAwesomeIcon
        icon={icon}
        className={className}
        style={
          style as React.CSSProperties & Record<`--fa-font-${string}`, string>
        }
      />
    )
  }
}
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
import { Link } from '@tanstack/react-router'

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
  const [tooltipEnabled, setTooltipEnabled] = useState(true)
  const [recentlyClickedDataset, setRecentlyClickedDataset] = useState<
    number | null
  >(null)
  const [hoveredDatasetIndex, setHoveredDatasetIndex] = useState<number | null>(
    null
  )

  // Use the segmented transform so datasets include _missingIndices for the
  // radarMissingSpokes plugin to draw dashed centre→axis spokes.
  const chartData = transformRadarDataWithSegments(data)


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

  const handleDatasetToggle = useCallback(
    (index: number) => {
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
    },
    [visibleDatasets]
  )


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
            onClick: (_event: ChartEvent, legendItem: LegendItem) => {
              const index = legendItem.datasetIndex
              if (index !== undefined) {
                handleDatasetToggle(index)
              }
            }
          }
        }
      }
    }
  }, [resolvedTheme, tooltipEnabled, chartData.datasets, handleDatasetToggle])

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

  const linkClass = `font-medium underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors duration-150 ${
    resolvedTheme === 'dim' ? 'text-primary' : 'text-base-content/80'
  }`

  const EDI_LAYERS = [
    {
      name: 'Consensus',
      description: (
        <>
          Measures the decentralisation of consensus participants (block
          producers). The metric used in the Decentralisation Compass is the
          Herfindahl-Hirschman Index (HHI), inverted and scaled. For broader
          comparisons across systems, metrics, and timeframes, see{' '}
          <Link to={consensusRoute.to} className={linkClass}>
            Consensus
          </Link>
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
      icon: faIcon(faCubes)
    },
    {
      name: 'Tokenomics',
      description: (
        <>
          Measures the decentralisation of native asset (token) ownership. The
          metric used in the Decentralisation Compass is the 3-concentration
          ratio, inverted and scaled. For broader comparisons across systems,
          metrics, and timeframes, see{' '}
          <Link to={tokenomicsRoute.to} className={linkClass}>
            Tokenomics
          </Link>
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
      icon: faIcon(faCoins)
    },
    {
      name: 'Software',
      description: (
        <>
          Measures the decentralisation of contributors to full node software
          implementations. The metric used in the Decentralisation Compass is
          the Herfindahl-Hirschman Index (HHI), inverted and scaled. For broader
          comparisons across systems, metrics, and timeframes, see{' '}
          <Link to={softwareRoute.to} className={linkClass}>
            Software
          </Link>
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
      icon: faIcon(faCode)
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
          <Link to={networkRoute.to} className={linkClass}>
            Network
          </Link>
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
      icon: faIcon(faNetworkWired)
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
          <Link to={geographyRoute.to} className={linkClass}>
            Geography
          </Link>
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
      icon: faIcon(faGlobe)
    }
  ]

  return (
    <div className={`card border border-base-300 shadow-sm bg-base-100 overflow-hidden ${className}`}>
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-base-200/50 border-b border-base-300">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-serif font-bold text-base-content leading-tight">{title}</h3>
          {description && (
            <p className="text-xs sm:text-sm text-base-content/60 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <label
            className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded cursor-pointer select-none"
            title="Toggle hover tooltip"
          >
            <input
              type="checkbox"
              checked={tooltipEnabled}
              onChange={() => setTooltipEnabled((v) => !v)}
              className="toggle toggle-xs toggle-primary"
              aria-label="Toggle hover tooltip"
            />
            <span className="hidden sm:inline">Tooltip</span>
          </label>
          {showExport && (
            <button
              className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded"
              onClick={handleExport}
              aria-label="Download chart as PNG"
              title="Download as PNG"
            >
              <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
              <span className="hidden sm:inline">Export PNG</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-6">

        {/* System Selection Toggle - iPhone Style Toggle Switches */}
        <ProtocolToggleGroup
          items={data}
          selectedIndices={visibleDatasets}
          onChange={handleDatasetToggle}
          recentlyClickedIndex={recentlyClickedDataset}
          hoveredIndex={hoveredDatasetIndex}
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
          <div className="w-full lg:w-1/3 bg-base-200/60 border border-base-300 rounded-xl p-3 sm:p-4">
            <AccordionGroup
              items={EDI_LAYERS.map((layer) => ({
                id: layer.name,
                title: layer.name,
                content: layer.description,
                icon: layer.icon,
                iconColor: layer.color
              }))}
              initialOpenId={EDI_LAYERS[0].name}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

function RadarChartSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card border border-base-300 shadow-sm bg-base-100 overflow-hidden ${className}`}>
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-base-200/50 border-b border-base-300">
        <div className="h-5 w-48 bg-base-200 animate-pulse rounded" />
      </div>
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="loading loading-spinner loading-md text-primary" />
          <p className="text-xs text-base-content/50">Loading comparison data…</p>
        </div>
      </div>
    </div>
  )
}
