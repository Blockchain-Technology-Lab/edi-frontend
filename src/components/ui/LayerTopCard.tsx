import { GitHubButton } from '@/components'
import { useNavigate } from '@tanstack/react-router'

type LayerTopCardProps = {
  title: string
  description: React.ReactNode
  imageSrc: string
  methodologyPath?: string
  githubUrl: string
  beta?: string
  betaTooltip?: string
}

export function LayerTopCard({
  title,
  description,
  imageSrc,
  methodologyPath,
  githubUrl,
  beta,
  betaTooltip
}: LayerTopCardProps) {
  const navigate = useNavigate()
  return (
    <div className="card lg:card-side border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <figure className="w-full lg:w-64 xl:w-72 lg:shrink-0 h-40 sm:h-48 lg:h-auto overflow-hidden bg-base-200">
        <img
          src={imageSrc}
          alt={title}
          className="block w-full h-full object-cover"
        />
      </figure>

      <div className="flex flex-col justify-between gap-3 p-5 sm:p-6 flex-1">
        <div className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-base-content leading-tight flex items-center gap-2 flex-wrap">
            {title}
            {beta && (
              <span
                className={`badge badge-sm bg-base-200 border border-base-300 text-base-content/70 font-normal${betaTooltip ? ' tooltip tooltip-bottom cursor-default' : ''}`}
                data-tip={betaTooltip}
              >
                <div className="inline-grid *:[grid-area:1/1] mr-1">
                  <div className="status status-warning animate-ping" />
                  <div className="status status-accent animate-bounce" />
                </div>
                {beta}
              </span>
            )}
          </h2>
          <p className="text-sm text-base-content/70 leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {methodologyPath && (
            <button
              className="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:text-base-content hover:border-base-content/40 font-medium"
              onClick={() => navigate({ to: methodologyPath })}
            >
              Methodology
            </button>
          )}
          <GitHubButton
            className="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:text-base-content hover:border-base-content/40 font-medium"
            label="Source Code"
            url={githubUrl}
          />
        </div>
      </div>
    </div>
  )
}
