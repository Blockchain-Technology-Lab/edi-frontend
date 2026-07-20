import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

type DoughnutTopCardProps = {
  title: string
  description: string
  imageSrc: string
  methodologyPath?: string
  btnTitle?: string
  children?: ReactNode
}

export function DoughnutTopCard({
  title,
  description,
  imageSrc,
  methodologyPath,
  btnTitle = 'Methodology',
  children
}: DoughnutTopCardProps) {
  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100 flex flex-col lg:flex-row">
      <div className={`flex flex-col lg:flex-row ${children ? 'lg:w-1/2' : 'flex-1'}`}>
        <figure className="w-full lg:w-64 xl:w-72 lg:shrink-0 h-40 sm:h-48 lg:h-auto overflow-hidden bg-base-200">
          <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
        </figure>
        <div className="flex flex-col justify-between gap-3 p-5 sm:p-6 flex-1">
          <div className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-base-content leading-tight">{title}</h2>
            <p className="text-sm text-base-content/70 leading-relaxed">{description}</p>
          </div>
          {methodologyPath && (
            <div className="pt-1">
              <Link
                to={methodologyPath}
                className="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:text-base-content hover:border-base-content/40 font-medium"
              >
                {btnTitle}
              </Link>
            </div>
          )}
        </div>
      </div>
      {children && (
        <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-base-300 flex flex-col">
          {children}
        </div>
      )}
    </div>
  )
}
