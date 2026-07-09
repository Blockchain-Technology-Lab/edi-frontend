import { MethodologyCard } from '@/components'
import { OverviewContent, MetricsContent } from '@/content'
import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LAYER_CONFIG, LAYER_KEYS } from '@/config/layers'

export function Methodology() {
  const location = useLocation()

  useEffect(() => {
    const segments = location.pathname.split('/')
    const section = segments[segments.length - 1]
    if (section && section !== 'methodology') {
      document
        .getElementById(`methodology-${section}`)
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.pathname])

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
            Overview
          </span>
        </div>
        <div className="p-5 sm:p-6 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-base-content leading-tight">
            Methodology
          </h1>
          <div className="space-y-3 text-sm text-base-content/70 leading-relaxed [&_p]:leading-relaxed">
            <OverviewContent />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <MethodologyCard
        label="Decentralisation measures"
        title="Metrics"
        content={MetricsContent}
      />

      {/* Layer Methodologies */}
      <div>
        <div className="mb-5">
          <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.18em] mb-1">
            Per-layer detail
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-base-content leading-tight">
            Layer Methodologies
          </h2>
        </div>
        <div className="space-y-4">
          {LAYER_KEYS.filter(key => LAYER_CONFIG[key].enabled).map(key => (
            <div id={`methodology-${key}`} key={key}>
              <MethodologyCard
                title={LAYER_CONFIG[key].label}
                content={LAYER_CONFIG[key].content}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
