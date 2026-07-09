import timelineData from '@/pages/changelog/changes.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faScaleBalanced,
  faCoins,
  faImage,
  faHouse,
  faNetworkWired,
  faGlobe,
  faCircleQuestion,
  faGavel
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

type ChangeEntry = {
  date: string
  icon: string
  title: string
  description: string[]
}

const iconMap: Record<string, IconDefinition> = {
  Scale: faScaleBalanced,
  Coins: faCoins,
  GitHub: faGithub,
  Image: faImage,
  House: faHouse,
  Network: faNetworkWired,
  Globe: faGlobe,
  Hive: faScaleBalanced,
  CircleHelp: faCircleQuestion,
  Gavel: faGavel
}


const topicLabels: Record<string, string> = {
  Scale: 'Consensus',
  Hive: 'Consensus',
  Coins: 'Tokenomics',
  GitHub: 'Software',
  Network: 'Network',
  Globe: 'Geography',
  Gavel: 'Governance',
  House: 'General',
  Image: 'General',
  CircleHelp: 'General'
}

const topicAccents: Record<
  string,
  { badge: string; icon: string; border: string; ring: string }
> = {
  Consensus: {
    badge: 'bg-sky-500/10',
    icon: 'text-sky-500',
    border: 'border-l-sky-500',
    ring: 'border-sky-500/30'
  },
  Tokenomics: {
    badge: 'bg-amber-500/10',
    icon: 'text-amber-500',
    border: 'border-l-amber-500',
    ring: 'border-amber-500/30'
  },
  Software: {
    badge: 'bg-violet-500/10',
    icon: 'text-violet-500',
    border: 'border-l-violet-500',
    ring: 'border-violet-500/30'
  },
  Network: {
    badge: 'bg-cyan-500/10',
    icon: 'text-cyan-500',
    border: 'border-l-cyan-500',
    ring: 'border-cyan-500/30'
  },
  Geography: {
    badge: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    border: 'border-l-emerald-500',
    ring: 'border-emerald-500/30'
  },
  Governance: {
    badge: 'bg-rose-500/10',
    icon: 'text-rose-500',
    border: 'border-l-rose-500',
    ring: 'border-rose-500/30'
  },
  General: {
    badge: 'bg-slate-500/10',
    icon: 'text-slate-500',
    border: 'border-l-slate-500',
    ring: 'border-slate-500/30'
  }
}

function formatChangeDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function groupByYear(entries: ChangeEntry[]): [number, ChangeEntry[]][] {
  const groups = new Map<number, ChangeEntry[]>()
  entries.forEach((entry) => {
    const year = new Date(entry.date).getFullYear()
    const group = groups.get(year)
    if (group) {
      group.push(entry)
    } else {
      groups.set(year, [entry])
    }
  })
  return Array.from(groups.entries()).sort(([a], [b]) => b - a)
}

export function ChangelogTimeline() {
  const sortedTimelineData: ChangeEntry[] = [...timelineData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const yearGroups = groupByYear(sortedTimelineData)

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <h2 className="text-sm font-semibold text-base-content">Updates</h2>
      </div>
      <div className="p-4 sm:p-6">
        {yearGroups.map(([year, entries], groupIndex) => (
          <div key={year} className={groupIndex > 0 ? 'mt-6' : ''}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-serif font-bold text-base-content">
                {year}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-base-200 text-base-content/50 text-[10px] font-mono font-semibold uppercase tracking-wider whitespace-nowrap">
                {entries.length} update{entries.length !== 1 ? 's' : ''}
              </span>
              <div className="flex-1 h-px bg-base-300" />
            </div>
            <ul className="timeline timeline-vertical timeline-compact">
              {entries.map((entry, index) => {
                const Icon = iconMap[entry.icon] || faCircleQuestion
                const topic = topicLabels[entry.icon] ?? 'General'
                const accent = topicAccents[topic] ?? topicAccents.General

                return (
                  <li key={`${entry.date}-${index}`}>
                    {index !== 0 && <hr className="bg-base-300" />}

                    <div className="timeline-middle">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full ${accent.badge}`}
                      >
                        <FontAwesomeIcon
                          icon={Icon}
                          className={`h-3.5 w-3.5 ${accent.icon}`}
                        />
                      </div>
                    </div>

                    <div
                      className={`timeline-end timeline-box w-full mb-4 p-0 overflow-hidden border border-l-4 border-base-300 ${accent.border} bg-base-100 shadow-sm`}
                    >
                      <div
                        className={`px-4 py-3 border-b border-base-200 ${accent.badge}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider ${accent.icon}`}
                          >
                            {topic}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-base-content leading-snug">
                            {entry.title}
                          </h3>
                          <time
                            dateTime={entry.date}
                            className={`shrink-0 px-2.5 py-1 rounded-md border bg-base-100 text-xs font-bold whitespace-nowrap ${accent.icon} ${accent.ring}`}
                          >
                            {formatChangeDate(entry.date)}
                          </time>
                        </div>
                      </div>
                      <ul className="list-disc text-sm ml-4 text-base-content/65 space-y-0.5 px-4 py-3">
                        {entry.description.map((point: string, i: number) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    {index !== entries.length - 1 && (
                      <hr className="bg-base-300" />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
