import { useContext } from 'react'
import { Link } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudArrowUp,
  faFileLines,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { ipfsRoute, dataFormatsRoute } from '@/router'
import { ThemeContext } from '@/contexts'

const GUIDES = [
  {
    icon: faCloudArrowUp,
    kicker: 'Guide',
    title: 'Share Your Data via IPFS',
    description:
      'A step-by-step guide for partners who want to contribute blockchain node datasets to the EDI project using IPFS.',
    to: ipfsRoute.to
  },
  {
    icon: faFileLines,
    kicker: 'Reference',
    title: 'Data Format Templates',
    description:
      'Raw-data schemas and templates for our decentralisation-analysis tools, by layer — so your data can be used as-is.',
    to: dataFormatsRoute.to
  }
]

export function Resources() {
  // "silk" is deliberately near-monochrome (primary/secondary/accent are all
  // the same near-black there), and "info" is a pale accent meant for a dark
  // surface — same fix as AppLink: no colour accent on silk, just base-content.
  const { theme } = useContext(ThemeContext)
  const accentText = theme === 'dim' ? 'text-info' : 'text-base-content/80'

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
            className="group card border border-base-300 shadow-sm overflow-hidden bg-base-100 hover:border-info/40 hover:shadow-md transition-all"
          >
            <div className="relative flex items-center gap-2.5 px-4 py-2.5 bg-base-200/50 border-b border-base-300 overflow-hidden">
              <FontAwesomeIcon
                icon={guide.icon}
                className="absolute -right-2 -top-2 w-12 h-12 text-base-content/[0.05] pointer-events-none"
              />
              <div className="w-7 h-7 rounded-md bg-info/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon
                  icon={guide.icon}
                  className={`w-3.5 h-3.5 ${accentText}`}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
                {guide.kicker}
              </span>
            </div>

            <div className="p-5 space-y-2">
              <h2 className="text-base font-serif font-bold text-base-content leading-snug">
                {guide.title}
              </h2>
              <p className="text-sm text-base-content/65 leading-relaxed">
                {guide.description}
              </p>
              <span
                className={`inline-flex items-center gap-1 pt-1 text-xs font-semibold ${accentText} transition-all group-hover:gap-2`}
              >
                Read guide
                <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
