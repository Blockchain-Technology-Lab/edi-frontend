import timelineData from "../../pages/changelog/changes.json"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as SolidIcons from "@fortawesome/free-solid-svg-icons"
import * as BrandIcons from "@fortawesome/free-brands-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// Helper function to safely get the icon
const getIcon = (iconName: string): IconProp | null => {
  const solidIcon = SolidIcons[iconName as keyof typeof SolidIcons] as IconProp
  const brandIcon = BrandIcons[iconName as keyof typeof BrandIcons] as IconProp
  return solidIcon || brandIcon || null // Check in both solid and brand icons
}

export function ChangelogTimeline() {
  // Sort the timeline data by date, most recent first
  const sortedTimelineData = timelineData.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })

  return (
    <div className="flowbite">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {sortedTimelineData.map((entry, index) => {
          // Fetch icon component dynamically using the helper function
          const IconComponent = getIcon(entry.icon)

          return (
            <li className="mb-10 ml-6" key={`${entry.date}-${index}`}>
              {" "}
              <span
                className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-6 ring-white dark:ring-gray-900 dark:bg-blue-500"
                aria-hidden="true"
              >
                {IconComponent ? (
                  <FontAwesomeIcon icon={IconComponent} />
                ) : (
                  <FontAwesomeIcon
                    icon={SolidIcons.faQuestionCircle}
                    className="text-gray-500"
                  /> // Default icon if missing
                )}
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {entry.title}
              </h3>
              <time className="inline-block px-2 py-1 mb-2 text-xs font-serif font-medium text-gray-700 border border-gray-300 rounded-full dark:border-gray-900 dark:text-gray-200 shadow-sm bg-gray-50 dark:bg-gray-700 ">
                {entry.date}
              </time>
              <div className="mb-4 text-base font-normal text-gray-700 dark:text-gray-300 ml-5">
                <ul className="list-disc ml-5">
                  {entry.description.map((point, i) => (
                    <li key={i} className="ml-2">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
