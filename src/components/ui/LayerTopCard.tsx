import { GitHubButton } from '@/components'
import { useNavigate } from '@tanstack/react-router'

type LayerTopCardProps = {
  title: string
  description: React.ReactNode
  imageSrc: string
  methodologyPath?: string
  githubUrl: string
}

export function LayerTopCard({
  title,
  description,
  imageSrc,
  methodologyPath,
  githubUrl
}: LayerTopCardProps) {
  const navigate = useNavigate()
  return (
    <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box h-full flex flex-col">
      <figure className="w-full lg:w-1/3 lg:max-w-xs h-48 sm:h-56 lg:h-56 overflow-hidden rounded-t-box lg:rounded-l-box lg:rounded-tr-none  shrink-0">
        <img
          src={imageSrc}
          alt={title}
          className="block w-full h-full object-cover"
        />
      </figure>
      <div className="card-body flex flex-col justify-between">
        <div>
          <h2 className="card-title text-2xl">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="card-actions justify-end gap-2">
          <button
            className="btn btn-outline"
            onClick={() => navigate({ to: methodologyPath })}
          >
            Methodology
          </button>
          <GitHubButton
            className="btn btn-outline"
            label="Source Code"
            url={githubUrl}
          />
        </div>
      </div>
    </div>
  )
}
