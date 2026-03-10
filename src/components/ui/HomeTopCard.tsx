import { methodologyTo } from '@/routes/routePaths'

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
    <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
      <figure className="w-full h-24 sm:h-48 md:h-60 overflow-hidden max-h-60">
        <img
          src={imageSrc}
          alt={title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body font-sans text-xl">
        <h2 className="card-title text-2xl">{title}</h2>
        <p className="tracking-wide text-lg">{description}</p>
        <div className="card-actions justify-end gap-2">
          <a
            href={methodologyTo}
            rel="noopener noreferrer"
            className={`btn btn-outline btn-dash btn-ghost text-base-content`}
            title={btnMethodDesc}
          >
            {btnMethod}
          </a>
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-outline btn-dash btn-ghost text-base-content`}
            title={btnWebDesc}
          >
            {btnWebsite}
          </a>
        </div>
      </div>
    </div>
  )
}
