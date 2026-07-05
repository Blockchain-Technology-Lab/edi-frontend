import { Link } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ipfsRoute } from '@/router'

const GUIDES = [
  {
    icon: faCloudArrowUp,
    title: 'Share Your Data via IPFS',
    description:
      'A step-by-step guide for partners who want to contribute blockchain node datasets to the EDI project using IPFS.',
    to: ipfsRoute.to
  }
]

export function Resources() {
  return (
    <div className="space-y-6">
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
            Guides & Docs
          </span>
        </div>
        <div className="p-5 sm:p-6 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-base-content leading-tight">
            Resources
          </h1>
          <p className="text-sm text-base-content/70 leading-relaxed">
            Guides for partners and contributors working with the EDI
            Dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GUIDES.map((guide) => (
          <Link
            key={guide.title}
            to={guide.to}
            className="card border border-base-300 shadow-sm bg-base-100 hover:border-primary/40 hover:shadow-md transition-all p-5 flex flex-row items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FontAwesomeIcon
                icon={guide.icon}
                className="w-4 h-4 text-primary"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-base font-serif font-bold text-base-content leading-snug">
                {guide.title}
              </h2>
              <p className="text-sm text-base-content/65 leading-relaxed">
                {guide.description}
              </p>
            </div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="w-3.5 h-3.5 text-base-content/30 mt-1.5 shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
