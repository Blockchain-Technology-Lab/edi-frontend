type MetricsTopCardProps = {
  title: string
  description: React.ReactNode
  imageSrc: string
  layout?: 'default' | 'split-50-50'
  imagePosition?: 'left' | 'right'
  control?: React.ReactNode
}

export function MetricsTopCard({
  title,
  description,
  imageSrc,
  layout = 'default',
  imagePosition = 'right',
  control
}: MetricsTopCardProps) {
  if (layout === 'split-50-50') {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className={`flex flex-col lg:flex-row items-stretch gap-0 ${imagePosition === 'left' ? '' : 'lg:flex-row-reverse'}`}>
          <figure className="w-full lg:w-1/2 h-48 lg:h-auto overflow-hidden bg-base-200 shrink-0">
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
          </figure>
          <div className="flex flex-col justify-center gap-3 p-5 sm:p-6 flex-1">
            <h2 className="text-lg font-serif font-bold text-base-content leading-tight">{title}</h2>
            <p className="text-sm text-base-content/70 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    )
  }

  if (control) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6">
          <figure className="w-full sm:w-36 xl:w-44 h-32 sm:h-28 overflow-hidden rounded-lg bg-base-200 shrink-0">
            <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
          </figure>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-base-content leading-tight mb-2">{title}</h2>
            <p className="text-sm text-base-content/70 leading-relaxed">{description}</p>
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row lg:flex-nowrap items-start
            px-5 sm:px-6 lg:py-4 border-t border-base-300/70 bg-base-200/30
            divide-y lg:divide-y-0 lg:divide-x divide-base-300/70
            [&>*]:min-w-0 [&>*]:py-3 lg:[&>*]:py-0
            lg:[&>*]:px-8 lg:[&>*:first-child]:pl-0 lg:[&>*:last-child]:pr-0"
        >
          {control}
        </div>
      </div>
    )
  }

  return (
    <div className="card lg:card-side border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <figure className="w-full lg:w-64 xl:w-72 lg:shrink-0 h-40 sm:h-48 lg:h-auto overflow-hidden bg-base-200">
        <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
      </figure>
      <div className="flex flex-col justify-center gap-3 p-5 sm:p-6 flex-1">
        <h2 className="text-lg font-serif font-bold text-base-content leading-tight">{title}</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
