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
      <div className="card bg-base-200 shadow-lg border border-base-300 rounded-box">
        <div className="card-body p-2">
          <div
            className={`flex flex-col lg:flex-row items-start gap-6 ${
              imagePosition === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="card-title text-2xl font-bold">{title}</h2>
              <p className="text-base-content/80 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2">
              <figure className="w-full overflow-hidden rounded-lg">
                <img
                  src={imageSrc}
                  alt={title}
                  className="w-full h-auto object-contain shadow-md"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (control) {
    return (
      <div className="card bg-base-200 shadow-lg border border-base-300 rounded-box">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_5fr_3fr] lg:items-center lg:gap-6">
            <figure className="w-full min-w-0 max-h-48 overflow-hidden rounded-lg">
              <img
                src={imageSrc}
                alt={title}
                className="object-cover w-full h-full"
              />
            </figure>

            <div className="w-full min-w-0">
              <h2 className="card-title text-2xl">{title}</h2>
              <p className="break-words">{description}</p>
            </div>

            <div className="w-full min-w-0">{control}</div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback to default layout
  return (
    <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
      <figure className="w-full lg:w-1/2 max-h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}
