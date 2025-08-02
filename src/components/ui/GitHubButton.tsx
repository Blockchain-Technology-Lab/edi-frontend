import { Github } from 'lucide-react';

type GitHubButtonProps = {
    url: string;
    label?: string;
    className?: string;
};

export function GitHubButton({ url, label, className = '' }: GitHubButtonProps) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-base-content hover:text-accent transition-colors gap-2 ${className}`}
            title="View on GitHub"
        >
            <Github className="w-5 h-5" />
            {label}
        </a>
    );
}
