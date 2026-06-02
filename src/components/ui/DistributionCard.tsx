type DistributionCardProps = {
  title: string
  imageSrc: string
  onClick?: () => void
}

export function DistributionCard({
  title,
  imageSrc,
  onClick
}: DistributionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card border border-base-300 shadow-sm bg-base-100 overflow-hidden cursor-pointer text-left h-full w-full
        hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="relative flex flex-col h-full">
        <div className="p-4 pb-2 z-10">
          <h2 className="text-sm font-semibold text-base-content leading-tight">{title}</h2>
          <p className="text-xs text-primary/70 mt-1 font-medium group-hover:text-primary transition-colors">
            View distribution ↓
          </p>
        </div>
        <figure className="flex-1 relative overflow-hidden min-h-20">
          <img
            src={imageSrc}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-50 transition-opacity duration-300"
          />
        </figure>
      </div>
    </button>
  )
}
