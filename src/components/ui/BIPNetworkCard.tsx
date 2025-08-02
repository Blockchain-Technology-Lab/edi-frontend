type BIPNetworkCardProps = {
  title: string;
  description: React.ReactNode;
  imageSrc: string;
};

export function BIPNetworkCard({
  title,
  description,
  imageSrc,
}: BIPNetworkCardProps) {
  return (
    <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 h-full rounded-box">
      <figure className="w-full lg:w-1/2">
        <img
          src={imageSrc}
          alt={title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end gap-2">

        </div>
      </div>
    </div>
  );
}
