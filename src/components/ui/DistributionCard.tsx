type DistributionCardProps = {
  title: string;
  imageSrc: string;
  onClick?: () => void;
};

export function DistributionCard({
  title,
  imageSrc,
  onClick,
}: DistributionCardProps) {
  return (
    <div
      className="col-span-1 bg-base-200 hover:bg-base-300 cursor-pointer h-full rounded-box shadow-md flex flex-col hover:scale-[1.06] transition-transform"
      onClick={onClick}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <figure className="w-full h-24 sm:h-48 md:h-60 overflow-hidden max-h-60">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover opacity-30 rounded-b-box hover:opacity-90"
        />
      </figure>
    </div>
  );
}
