import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCodePullRequest,
  faFileLines,
  faScaleBalanced,
  faCode,
  faCubesStacked,
  faComments,
  faChevronRight,
  faCircle,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { GOVERNANCE_METHODOLOGY_DIAGRAM } from '@/utils/paths'

type Stage = {
  number: number
  title: string
  subtitle: string | null
  icon: IconDefinition
  covered: boolean
  description: string
}

const stages: Stage[] = [
  {
    number: 1,
    title: 'Ideation',
    subtitle: 'Formal Review',
    icon: faCodePullRequest,
    covered: true,
    description:
      'Author submits a PR on GitHub; reviewers discuss, request changes, and merge or reject.'
  },
  {
    number: 2,
    title: 'Proposal',
    subtitle: null,
    icon: faFileLines,
    covered: true,
    description:
      'Editor assigns an official proposal ID; the proposal enters the repository with a formal status.'
  },
  {
    number: 3,
    title: 'Ratification',
    subtitle: null,
    icon: faScaleBalanced,
    covered: true,
    description:
      'Editors and community formally accept or reject the proposal through consensus.'
  },
  {
    number: 4,
    title: 'Implementation',
    subtitle: null,
    icon: faCode,
    covered: false,
    description:
      'Accepted proposals are integrated into protocol software by developers.'
  },
  {
    number: 5,
    title: 'Adoption',
    subtitle: null,
    icon: faCubesStacked,
    covered: false,
    description:
      'Implemented changes are taken up across wallets, clients, and tools.'
  }
]

function StageCard({ stage }: { stage: Stage }) {
  const covered = stage.covered

  return (
    <div
      className={`
        flex flex-col items-center text-center gap-2 rounded-xl border p-3 sm:p-4 flex-1 min-w-0 transition-colors
        ${
          covered
            ? 'bg-primary/5 border-primary/20'
            : 'bg-base-200/40 border-base-300 opacity-60'
        }
      `}
    >
      {/* Stage number + status badge */}
      <div className="flex items-center gap-1.5">
        <span
          className={`text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
            covered
              ? 'text-primary border-primary/30 bg-primary/8'
              : 'text-base-content/40 border-base-300 bg-base-200'
          }`}
        >
          {stage.number}
        </span>
        {!covered && (
          <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-base-content/35 border border-base-300 rounded px-1 py-0.5 bg-base-200">
            planned
          </span>
        )}
      </div>

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          covered
            ? 'bg-primary/10 text-primary'
            : 'bg-base-300/50 text-base-content/30'
        }`}
      >
        <FontAwesomeIcon icon={stage.icon} className="h-4 w-4" />
      </div>

      {/* Title */}
      <div>
        <p
          className={`text-xs font-semibold leading-tight ${
            covered ? 'text-base-content/85' : 'text-base-content/40'
          }`}
        >
          {stage.title}
        </p>
        {stage.subtitle && (
          <p
            className={`text-[10px] mt-0.5 ${covered ? 'text-base-content/50' : 'text-base-content/30'}`}
          >
            {stage.subtitle}
          </p>
        )}
      </div>

      {/* Description */}
      <p
        className={`text-[11px] leading-relaxed hidden sm:block ${
          covered ? 'text-base-content/55' : 'text-base-content/30'
        }`}
      >
        {stage.description}
      </p>
    </div>
  )
}

function Arrow({ covered }: { covered: boolean }) {
  return (
    <div className="flex items-center flex-shrink-0 px-1 self-center">
      <FontAwesomeIcon
        icon={faChevronRight}
        className={`h-3 w-3 ${covered ? 'text-primary/40' : 'text-base-content/20'}`}
      />
    </div>
  )
}

export function GovernanceLifecycleDiagram() {
  return (
    <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-sm not-prose">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <div>
          <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.14em]">
            Governance
          </p>
          <h3 className="text-sm font-semibold text-base-content leading-tight">
            Five-Stage Proposal Lifecycle
          </h3>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={GOVERNANCE_METHODOLOGY_DIAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono text-base-content/40 hover:text-base-content/70 transition-colors"
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="h-2.5 w-2.5"
            />
            View diagram
          </a>
          <span className="flex items-center gap-1 text-[10px] font-mono text-primary/70">
            <FontAwesomeIcon icon={faCircle} className="h-1.5 w-1.5" />
            Covered
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-base-content/35">
            <FontAwesomeIcon icon={faCircle} className="h-1.5 w-1.5" />
            Planned
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* Stage cards row */}
        <div className="flex items-stretch gap-0">
          {stages.map((stage, i) => (
            <div
              key={stage.number}
              className="flex items-stretch flex-1 min-w-0"
            >
              {i > 0 && (
                <Arrow covered={stages[i - 1].covered && stage.covered} />
              )}
              <StageCard stage={stage} />
            </div>
          ))}
        </div>

        {/* Community Deliberation banner */}
        <div className="rounded-lg border border-base-300 bg-base-200/40 overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5">
            <div className="flex items-center gap-2 text-base-content/60">
              <div className="w-6 h-6 rounded-lg bg-base-300/60 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon
                  icon={faComments}
                  className="h-3 w-3 text-base-content/40"
                />
              </div>
              <span className="text-xs font-semibold text-base-content/65">
                Community Deliberation
              </span>
            </div>
            <p className="text-[11px] text-base-content/45 leading-relaxed">
              Informal discussion on mailing lists, forums, and social media —
              running concurrently with stages 1–3 (bitcoin-dev, BitcoinTalk,
              Ethereum Magicians, Cardano Forum).
            </p>
            <span className="ml-auto text-[10px] font-mono text-base-content/35 border border-base-300 rounded px-1.5 py-0.5 bg-base-100 whitespace-nowrap shrink-0">
              concurrent · stages 1–3
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
