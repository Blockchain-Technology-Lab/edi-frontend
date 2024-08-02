import Link from "next/link"
import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"
import { EnvelopeAt, ShieldShaded, UniversalAccess } from "@/components"

export function Footer() {
  return (
    <footer
      className={twJoin(
        "flex flex-col items-center text-center gap-3 pt-8 pb-10 mt-8",
        "border-t border-slate-800/25 dark:border-slate-200/25 gap-4"
      )}
    >
      <p>
        <a
          className="mr-1"
          href="https://www.ed.ac.uk/informatics/blockchain/edi/"
          target="_blank"
        >
          EDI
        </a>
        <span>© 2024 Edinburgh Decentralisation Index.</span>
      </p>
      <ul className="inline-flex justify-center flex-wrap gap-y-2 gap-x-4">
        <ListItem>
          <UniversalAccess />
          <Link href="../accessibility.html">Accessibility</Link>
        </ListItem>
        <ListItem>
          <ShieldShaded />
          <a
            href="https://computing.help.inf.ed.ac.uk/logging-policy"
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            Privacy
          </a>
        </ListItem>
        <ListItem>
          <EnvelopeAt />
          <a href="mailto:edi@ed.ac.uk">edi@ed.ac.uk</a>
        </ListItem>
      </ul>
    </footer>
  )
}

function ListItem({ children }: { children?: ReactNode }) {
  return <li className="flex items-center gap-1">{children}</li>
}
