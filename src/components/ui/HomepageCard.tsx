import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import { Link } from '@tanstack/react-router'

type HomepageCardProps = {
  title: string
  desc: string
  icon: ReactNode
  onPress: () => void
  disabled?: boolean
  background: string
  github?: string
  methodologyLink?: string
}

export function HomepageCard({
  title,
  desc,
  icon,
  background,
  onPress,
  disabled = false,
  github = '',
  methodologyLink = ''
}: HomepageCardProps) {
  return (
    <div
      onClick={!disabled ? onPress : undefined}
      className={`group card border border-base-300 bg-base-100 overflow-hidden transition-all duration-200
        ${disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5'
        }`}
    >
      <figure className="w-full h-36 sm:h-44 overflow-hidden bg-base-200">
        <img
          src={background}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </figure>

      <div className="p-4 flex flex-col gap-2 flex-1 relative">
        {/* Watermark icon */}
        <div className="absolute top-3 right-3 opacity-[0.06] text-base-content pointer-events-none text-4xl">
          {icon}
        </div>

        <h2 className="text-base font-semibold text-base-content leading-tight pr-6">{title}</h2>
        <p className="text-xs text-base-content/60 leading-relaxed">{desc}</p>

        {(github || methodologyLink) && (
          <div className="flex items-center gap-2 mt-auto pt-2">
            {methodologyLink && (
              <Link
                to={methodologyLink}
                className="inline-flex items-center gap-1 text-xs text-base-content/50 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FontAwesomeIcon icon={faFileLines} className="w-3 h-3" />
                <span>Methodology</span>
              </Link>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-base-content/50 hover:text-primary transition-colors ml-auto"
                title="GitHub"
                aria-label="GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
