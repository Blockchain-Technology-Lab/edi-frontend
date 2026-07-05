import {
  accessibilityRoute,
  changelogRoute,
  infographicsRoute,
  ipfsRoute
} from '@/router'
import { Link } from '@tanstack/react-router'
import {
  faArrowUpRightFromSquare,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { ShortcutsHelp } from '@/components'
import { INFORMATICS_LOGO } from '@/utils/paths'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Footer() {
  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buildDate = import.meta.env.VITE_BUILD_DATE
    ? new Date(import.meta.env.VITE_BUILD_DATE).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Build date not available'

  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content px-4 pt-3 pb-4 sm:p-4 relative gap-y-5">
      {/* Action buttons — always pinned top-right so they never consume a row */}
      <div className="absolute right-4 top-3 flex items-center gap-2 z-10">
        <ShortcutsHelp />
        <button
          onClick={scrollToTop}
          className="btn btn-circle btn-sm btn-ghost opacity-60 hover:opacity-100 transition-opacity hover:scale-105"
          aria-label="Back to top"
          title="Back to top (Ctrl + Home)"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4" />
        </button>
      </div>

      {/* Brand */}
      <aside className="flex flex-col gap-2 w-full sm:w-auto pr-20 sm:pr-24">
        <p>
          <span className="text-lg font-bold">
            Edinburgh Decentralisation Index™
          </span>
          <br />
          is a registered trademark in the UK.
        </p>
        <a
          href="https://informatics.ed.ac.uk/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-fit"
          aria-label="School of Informatics"
        >
          <img
            src={INFORMATICS_LOGO}
            alt="School of Informatics"
            className="h-6 sm:h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </a>
        <div className="text-[10px] opacity-60">{buildDate}</div>
      </aside>

      {/*
        Nav sections:
        - Mobile: 3-column grid so they sit side-by-side in one row
        - sm+: `contents` dissolves the wrapper so the navs become direct
               footer children and DaisyUI's horizontal layout handles them
      */}
      <div className="grid grid-cols-3 gap-x-4 sm:contents">
        <nav className="text-sm flex flex-col gap-2">
          <h6 className="footer-title">Project</h6>
          <Link to={changelogRoute.to} className="link link-hover">
            Changelog
          </Link>
          <Link to={ipfsRoute.to} className="link link-hover">
            Share Your Data
          </Link>
          <a
            className="link link-hover flex items-center gap-1"
            href="https://github.com/Blockchain-Technology-Lab/edi-frontend"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
            GitHub
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-2.5 h-2.5"
            />
          </a>
        </nav>

        <nav className="text-sm flex flex-col gap-2">
          <h6 className="footer-title">BTL</h6>
          <a
            className="link link-hover flex items-center gap-1"
            href="https://informatics.ed.ac.uk/blockchain"
            target="_blank"
            rel="noopener noreferrer"
          >
            About us
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-2.5 h-2.5"
            />
          </a>
          <a className="link link-hover" href="mailto:edi@ed.ac.uk">
            Contact
          </a>
          <Link to={infographicsRoute.to} className="link link-hover">
            Infographics
          </Link>
        </nav>

        <nav className="text-sm flex flex-col gap-2">
          <h6 className="footer-title">Legal</h6>
          <a
            className="link link-hover flex items-center gap-1"
            href="https://computing.help.inf.ed.ac.uk/logging-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-2.5 h-2.5"
            />
          </a>
          <Link to={accessibilityRoute.to} className="link link-hover">
            Accessibility
          </Link>
        </nav>
      </div>
    </footer>
  )
}
