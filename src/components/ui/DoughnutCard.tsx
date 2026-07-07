import { DoughnutChartRenderer } from '@/components'
import type { LayerType } from '@/utils'
import Tippy from '@tippyjs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

interface DoughnutCardProps {
  type: LayerType
  title: string
  path: string
  fileName: string
  githubUrl?: string
  description?: string
  showInfo?: boolean
  othersThreshold?: number
}

export function DoughnutCard({
  type,
  title,
  path,
  fileName,
  githubUrl,
  description,
  showInfo = false,
  othersThreshold
}: DoughnutCardProps) {
  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100" key={title}>
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <span className="text-sm font-semibold text-base-content leading-snug truncate min-w-0 flex-1">
          {title}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {showInfo && description && (
            <Tippy content={description} placement="bottom">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content/70"
                aria-label={`Info about "${title}"`}
              >
                <FontAwesomeIcon icon={faInfo} className="w-3 h-3" />
              </button>
            </Tippy>
          )}
          {githubUrl && (
            <Tippy content="View on GitHub" placement="bottom">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content/70"
                aria-label={`View ${title} on GitHub`}
              >
                <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" />
              </a>
            </Tippy>
          )}
        </div>
      </div>
      {/* Chart */}
      <div className="p-4">
        {path ? (
          <DoughnutChartRenderer
            type={type}
            key={title}
            path={path}
            fileName={fileName}
            othersThreshold={othersThreshold}
          />
        ) : (
          <div className="alert alert-warning">
            <span>Chart data not available for {title}</span>
          </div>
        )}
      </div>
    </div>
  )
}
