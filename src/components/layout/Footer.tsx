import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"
import {
  EnvelopeAt,
  Link,
  LinkProps,
  ShieldShaded,
  UniversalAccess
} from "@/components"

export function Footer() {
  return (
    <footer
      className={twJoin(
        "flex flex-col items-center text-center gap-3 pt-8 pb-10 mt-8",
        "border-t border-slate-800/25 dark:border-slate-200/25 gap-4"
      )}
    >
      <p className="space-x-1">
        <FooterLink href="https://www.ed.ac.uk/informatics/blockchain/edi/">
          EDI
        </FooterLink>
        <span>© 2024 Edinburgh Decentralisation Index.</span>
      </p>
      <ul className="inline-flex justify-center flex-wrap gap-y-2 gap-x-4">
        <ListItem>
          <UniversalAccess />
          <FooterLink href="/accessibility">Accessibility</FooterLink>
        </ListItem>
        <ListItem>
          <ShieldShaded />
          <FooterLink href="https://computing.help.inf.ed.ac.uk/logging-policy">
            Privacy
          </FooterLink>
        </ListItem>
        <ListItem>
          <EnvelopeAt />
          <FooterLink href="mailto:edi@ed.ac.uk">edi@ed.ac.uk</FooterLink>
        </ListItem>
      </ul>
    </footer>
  )
}

function ListItem({ children }: { children?: ReactNode }) {
  return <li className="flex items-center gap-1">{children}</li>
}

function FooterLink(props: LinkProps) {
  return (
    <Link
      className="text-blue-700 hover:text-blue-800 underline underline-offset-2 transition-colors dark:text-blue-500 dark:hover:text-blue-400"
      {...props}
    />
  )
}
