import { HomepageCard, HomeTopCard, RadarChart } from '@/components'
import { useRadarCsv } from '@/hooks'
import { EDI_CARD, RADAR_CSV } from '@/utils/paths'
import { useNavigate } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LAYER_CONFIG, LAYER_KEYS } from '@/config/layers'

export default function HomePage() {
  const navigate = useNavigate()

  const {
    data: radarData,
    loading: radarLoading,
    error: radarError
  } = useRadarCsv(RADAR_CSV)

  return (
    <div className="space-y-8">
      {/* Intro card */}
      <HomeTopCard
        title=""
        description="The Edinburgh Decentralisation Index (EDI) studies blockchain decentralisation from first principles, archives relevant datasets, develops metrics, and offers a dashboard to track decentralisation trends over time and across systems."
        imageSrc={EDI_CARD}
        btnWebsite="Website"
        btnWebDesc="Visit the EDI website for more information"
        btnMethod="Methodology"
        btnMethodDesc="View the methodology for the EDI"
        webUrl="https://informatics.ed.ac.uk/blockchain/edi"
      />

      {/* Protocol Comparison Radar Chart */}
      {radarLoading ? (
        <div className="flex items-center justify-center h-56 rounded-xl border border-base-300 bg-base-100">
          <div className="text-center space-y-2">
            <div className="loading loading-spinner loading-md text-primary" />
            <p className="text-xs text-base-content/50">
              Loading comparison data…
            </p>
          </div>
        </div>
      ) : radarError ? (
        <div className="alert alert-error">
          <span>Failed to load comparison data: {radarError}</span>
        </div>
      ) : (
        <RadarChart
          data={radarData}
          title="Decentralisation Compass"
          description="Navigating the layers of blockchain decentralisation"
          showExport={true}
          showLegendToggle={true}
          className="w-full"
        />
      )}

      {/* Layer cards */}
      <div>
        <h2 className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em] mb-4">
          Layers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {LAYER_KEYS.map(key => {
            const cfg = LAYER_CONFIG[key]
            return (
              <HomepageCard
                key={key}
                title={cfg.label}
                desc={cfg.desc}
                icon={<FontAwesomeIcon icon={cfg.icon} size="lg" />}
                background={cfg.cardImage}
                onPress={() => navigate({ to: cfg.path })}
                disabled={!cfg.enabled}
                github={cfg.github}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
