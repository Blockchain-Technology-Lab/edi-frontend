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

const iconMap: Record<string, IconDefinition> = {
  Scale: faScaleBalanced,
  Coins: faCoins,
  GitHub: faGithub,
  Image: faImage,
  House: faHouse,
  Network: faNetworkWired,
  Globe: faGlobe,
  Hive: faGlobe,
  CircleHelp: faCircleQuestion,
  Gavel: faGavel
}

export function ChangelogTimeline() {
  const sortedTimelineData = [...timelineData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <h2 className="text-sm font-semibold text-base-content">Updates</h2>
      </div>
      <div className="p-4 sm:p-6">
        <ul className="timeline timeline-vertical timeline-compact">
          {sortedTimelineData.map(
            (
              entry: {
                date: string
                icon: string
                title: string
                description: string[]
              },
              index
            ) => {
              const Icon = iconMap[entry.icon] || faCircleQuestion

              return (
                <li key={`${entry.date}-${index}`}>
                  {index !== 0 && <hr className="bg-base-300" />}

                  <div className="timeline-middle">
                    <FontAwesomeIcon
                      icon={Icon}
                      className="h-4 w-4 text-primary/60"
                    />
                  </div>

                  <div className="timeline-end timeline-box mb-4 border border-base-300 bg-base-100 shadow-sm">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                      <span className="text-sm font-semibold text-base-content">
                        {entry.title}
                      </span>
                      <time className="font-mono text-xs text-base-content/40">
                        {entry.date}
                      </time>
                    </div>
                    <ul className="list-disc text-sm ml-4 text-base-content/65 space-y-0.5">
                      {entry.description.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {index !== sortedTimelineData.length - 1 && (
                    <hr className="bg-base-300" />
                  )}
                </li>
              )
            }
          )}
        </ul>
      </div>
    </div>
  )
}
