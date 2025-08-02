import { GitHubButton } from "@/components";
import { useNavigate } from "@tanstack/react-router";

type LayerTopCardProps = {
  title: string;
  description: React.ReactNode;
  imageSrc: string;
  methodologyPath?: string;
  githubUrl: string;
};

export function LayerTopCard({
  title,
  description,
  imageSrc,
  methodologyPath,
  githubUrl,
}: LayerTopCardProps) {
  const navigate = useNavigate();
  return (
    <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 h-full rounded-box">
      <figure className="w-full lg:w-1/2 max-h-60">
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
  );
}
