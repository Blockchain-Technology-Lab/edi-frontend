import { Link, Navigate, useParams } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { IpfsStepCard, IpfsTileLabel } from '@/components'
import { IPFS_STEPS, IPFS_TILE_TONE_CLASSES, getIpfsStep } from '@/config/ipfsTutorial'
import { ipfsRoute, ipfsStepRoute } from '@/router'

export function IpfsTutorialStep() {
  const { step: stepKey } = useParams({ strict: false })
  const step = getIpfsStep(stepKey)

  if (!step) {
    return <Navigate to={ipfsRoute.to} />
  }

  const index = IPFS_STEPS.findIndex((s) => s.key === step.key)
  const prev = index > 0 ? IPFS_STEPS[index - 1] : undefined
  const next = index < IPFS_STEPS.length - 1 ? IPFS_STEPS[index + 1] : undefined

  return (
    <div className="space-y-6">
      <IpfsStepCard
        kicker={`Sharing Your Node Data With Us — ${step.label}`}
        title={step.title}
        content={step.content}
        contentWidth={step.contentWidth}
        footer={
          <div className="flex items-stretch justify-between gap-3">
            {prev ? (
              <Link
                to={ipfsStepRoute.to}
                params={{ step: prev.key }}
                className={`group flex items-center gap-2.5 rounded-xl border bg-base-300 transition-all hover:shadow-sm px-3.5 py-2.5 max-w-[48%] ${IPFS_TILE_TONE_CLASSES.neutral}`}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 text-base-content/40 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <IpfsTileLabel kicker={prev.label} title={prev.title} truncateTitle className="flex-1" />
              </Link>
            ) : (
              <Link
                to={ipfsRoute.to}
                className={`group flex items-center gap-2.5 rounded-xl border bg-base-300 transition-all hover:shadow-sm px-3.5 py-2.5 ${IPFS_TILE_TONE_CLASSES.neutral}`}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 text-base-content/40 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-semibold text-base-content">Overview</span>
              </Link>
            )}
            {next && (
              <Link
                to={ipfsStepRoute.to}
                params={{ step: next.key }}
                className={`group flex items-center gap-2.5 rounded-xl border transition-all hover:shadow-sm px-3.5 py-2.5 max-w-[48%] ${IPFS_TILE_TONE_CLASSES.primary}`}
              >
                <IpfsTileLabel
                  kicker={next.label}
                  title={next.title}
                  tone="primary"
                  align="end"
                  truncateTitle
                  className="flex-1"
                />
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        }
      />
    </div>
  )
}
