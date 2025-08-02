type MetricsTopCardProps = {
  title: string;
  description: React.ReactNode;
  imageSrc: string;
  layout?: 'default' | 'split-50-50';
  imagePosition?: 'left' | 'right';
};

export function MetricsTopCard({
  title,
  description,
  imageSrc,
  layout = 'default',
  imagePosition = 'right',
}: MetricsTopCardProps) {
  if (layout === 'split-50-50') {
    return (
      <div className="card bg-base-200 shadow-lg border border-base-300 rounded-box">
        <div className="card-body p-6">
          <div
            className={`flex flex-col lg:flex-row items-start gap-6 ${imagePosition === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
          >
            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="card-title text-2xl font-bold">{title}</h2>
              <p className="text-base-content/80 leading-relaxed">{description}</p>
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
    );
  }

  // Fallback to default layout
  return (
    <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
      <figure className="w-full lg:w-1/2 max-h-48 overflow-hidden">
        <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
