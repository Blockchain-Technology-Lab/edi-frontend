import { methodologyTo } from '@/routes/routePaths'
import { Link } from '@tanstack/react-router'

type HomeTopCardProps = {
  title: string
  description: string
  imageSrc: string
  webUrl?: string
  btnWebsite?: string
  btnWebDesc?: string
  btnMethod?: string
  btnMethodDesc?: string
}

export function HomeTopCard({
  title,
  description,
  imageSrc,
  webUrl,
  btnWebsite = 'Website',
  btnWebDesc = '',
  btnMethod = 'Methodology',
  btnMethodDesc = ''
}: HomeTopCardProps) {
  return (
    <div className="card lg:card-side border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <figure className="w-full lg:w-72 xl:w-80 lg:shrink-0 h-48 lg:h-auto overflow-hidden bg-base-200">
        <img
          src={imageSrc}
          alt={title || 'EDI'}
          className="object-cover w-full h-full"
        />
      </figure>

      <div className="flex flex-col justify-between gap-4 p-5 sm:p-6 flex-1">
        {title && (
          <h2 className="text-lg font-serif font-bold text-base-content leading-tight">{title}</h2>
        )}
        <p className="text-sm sm:text-base text-base-content/75 leading-relaxed">{description}</p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link
            to={methodologyTo as never}
            className="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:text-base-content hover:border-base-content/40 font-medium"
            title={btnMethodDesc}
          >
            {btnMethod}
          </Link>
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:text-base-content hover:border-base-content/40 font-medium"
            title={btnWebDesc}
          >
            {btnWebsite}
          </a>
        </div>
      </div>
    </div>
  )
}
