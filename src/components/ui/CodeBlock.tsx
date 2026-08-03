import {
  cloneElement,
  isValidElement,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons'
import { ThemeContext, type DaisyTheme } from '@/contexts'

const JSON_TOKEN_REGEX =
  /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g

const JSON_TOKEN_CLASSES: Record<
  DaisyTheme,
  { key: string; string: string; number: string; literal: string; punctuation: string }
> = {
  dim: {
    key: 'text-info',
    string: 'text-success',
    number: 'text-secondary',
    literal: 'text-warning',
    punctuation: 'text-base-content/40'
  },
  silk: {
    key: 'text-info-content',
    string: 'text-success-content',
    number: 'text-base-content',
    literal: 'text-warning-content',
    punctuation: 'text-base-content/40'
  }
}

function highlightJson(code: string, theme: DaisyTheme): ReactNode[] {
  const classes = JSON_TOKEN_CLASSES[theme]
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let tokenIndex = 0

  for (const match of code.matchAll(JSON_TOKEN_REGEX)) {
    const token = match[0]
    const index = match.index

    if (index > lastIndex) {
      nodes.push(code.slice(lastIndex, index))
    }

    let className: string
    if (token.startsWith('"')) {
      const isKey = /^\s*:/.test(code.slice(index + token.length))
      className = isKey ? classes.key : classes.string
    } else if (token === 'true' || token === 'false' || token === 'null') {
      className = classes.literal
    } else if (/^[{}[\],:]$/.test(token)) {
      className = classes.punctuation
    } else {
      className = classes.number
    }

    nodes.push(
      <span key={tokenIndex++} className={className}>
        {token}
      </span>
    )
    lastIndex = index + token.length
  }

  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex))
  }

  return nodes
}


function highlightChildren(children: ReactNode, theme: DaisyTheme): ReactNode {
  if (!isValidElement(children)) return children

  const codeProps = children.props as { className?: string; children?: ReactNode }
  if (
    !codeProps.className?.includes('language-json') ||
    typeof codeProps.children !== 'string'
  ) {
    return children
  }

  return cloneElement(children as React.ReactElement, {}, highlightJson(codeProps.children, theme))
}

export function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const { theme } = useContext(ThemeContext)

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — nothing sensible to fall back to.
    }
  }

  return (
    <div className="relative w-fit max-w-full">
      <pre ref={preRef} {...props}>
        {highlightChildren(children, theme)}
      </pre>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-xl bg-gradient-to-l from-base-300 to-transparent" />
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition-colors"
      >
        <FontAwesomeIcon
          icon={copied ? faCheck : faCopy}
          className={`w-3.5 h-3.5 ${copied ? 'text-success' : ''}`}
        />
      </button>
    </div>
  )
}
