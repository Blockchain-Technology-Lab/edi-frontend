import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

type GitHubButtonProps = {
  url: string
  label?: string
  className?: string
}

export function GitHubButton({
  url,
  label,
  className = ''
}: GitHubButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-base-content hover:text-accent transition-colors gap-2 ${className}`}
      title="View on GitHub"
    >
      <FontAwesomeIcon icon={faGithub} size="lg" />
      {label}
    </a>
  )
}
