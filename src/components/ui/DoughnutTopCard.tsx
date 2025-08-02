import { useNavigate } from "@tanstack/react-router";

type DoughnutTopCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  methodologyPath: string;
  btnTitle?: string;
};

export function DoughnutTopCard({
  title,
  description,
  imageSrc,
  methodologyPath,
  btnTitle = "Methodology",
}: DoughnutTopCardProps) {
  const navigate = useNavigate();

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
        <div className="card-actions justify-end gap-2">
          <button
            className="btn btn-outline text-base-content"
            onClick={() => navigate({ to: methodologyPath })}
          >
            {btnTitle}
          </button>
        </div>
      </div>
    </div>
  );
}
