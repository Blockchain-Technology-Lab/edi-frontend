import { Link } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { IpfsOverviewContent } from '@/content'
import { IPFS_STEPS, IPFS_TILE_TONE_CLASSES } from '@/config/ipfsTutorial'
import { ipfsStepRoute } from '@/router'
import { IpfsExplainerVideo, IpfsProse, IpfsTileLabel } from '@/components'

export function IpfsTutorial() {
  return (
    <div className="space-y-6">
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
            Resources
          </span>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-base-content leading-tight">
            Sharing Your Node Data With Us
          </h1>
          <IpfsProse className="space-y-3">
            <IpfsOverviewContent />
          </IpfsProse>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-1/2">
          <IpfsExplainerVideo />
        </div>

        <div className="sm:w-1/2">
          <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.18em] mb-3">
            Steps
          </p>
          <div className="grid grid-cols-1 gap-3">
            {IPFS_STEPS.map((step) => (
              <Link
                key={step.key}
                to={ipfsStepRoute.to}
                params={{ step: step.key }}
                className={`group flex items-center gap-2.5 rounded-xl border bg-base-300 transition-all hover:shadow-sm px-3.5 py-2.5 ${IPFS_TILE_TONE_CLASSES.neutral}`}
              >
                <IpfsTileLabel
                  kicker={step.label}
                  title={step.title}
                  kickerTone="primary"
                  className="flex-1"
                />
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="w-3 h-3 text-base-content/30 shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
