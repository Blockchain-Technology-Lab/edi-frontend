import type { ReactNode } from "react";
import { Github, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";

type HomepageCardProps = {
  title: string;
  desc: string;
  icon: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  background: string;
  github?: string;
  methodologyLink?: string;
};

export function HomepageCard({
  title,
  desc,
  icon,
  background,
  onPress,
  disabled = false,
  github = "",
  methodologyLink = "",
}: HomepageCardProps) {
  return (
    <div
      onClick={!disabled ? onPress : undefined}
      className={`card m-2   bg-base-200 shadow-md  cursor-pointer transition duration-300 ease-in-out 
        ${disabled ? "opacity-80 cursor-not-allowed" : "hover:scale-105"}`}
    >
      <figure className="w-full h-24 sm:h-48 md:h-60 overflow-hidden">
        <img
          src={background}
          alt={title}
          className="object-contain w-full h-full"
        />
      </figure>
      {/* Header */}
      <div className="card-body pb-4 bg-base-300">
        <h2 className="card-title text-xl font-bold font-sans">{title}</h2>

        {/* Icon as background */}
        <div className="absolute top-2 right-2 text-[64px] opacity-10 text-base-content pointer-events-none">
          {icon}
        </div>

        {/* Description */}
        <p className="text-sm font-mono mt-2 pr-8 ">{desc}</p>
      </div>

      {/* Footer (optional) */}
      <div className="card-actions justify-end m-1 p-1 pt-1" >
        {methodologyLink && (
          <Link
            to={methodologyLink}
            className="btn-xs text-base-content hover:text-accent transition-colors"
            onClick={(e) => e.stopPropagation()} // prevent card click
          >
            <FileText size={24} />
          </Link>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-content hover:text-accent transition-colors"
            title="GitHub"
            aria-label="GitHub"
            onClick={(e) => e.stopPropagation()} // prevent card click
          >
            <Github size={24} />
          </a>
        )}
      </div>
    </div>
  );
}
