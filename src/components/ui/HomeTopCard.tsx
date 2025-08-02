type HomeTopCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  webUrl?: string;
  btnTitle?: string;
  btnDesc?: string;
};

export function HomeTopCard({
  title,
  description,
  imageSrc,
  webUrl,
  btnTitle = "Website",
  btnDesc = ''
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
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-outline btn-dash btn-ghost text-base-content`}
            title={btnDesc}
          >
            {btnTitle}
          </a>
        </div>
      </div>
    </div>
  );
}
