import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"
import {
  EnvelopeAt,
  Link,
  LinkProps,
  ShieldShaded,
  UniversalAccess,
  CodePoint,
  Infograph
} from "@/components"

export function Footer() {
  return (
    <footer
      className={twJoin(
        "flex flex-col items-center text-center pt-2 pb-2 ",
        "border-slate-800/25 dark:border-slate-200/25 gap-2"
      )}
    >
      <p className="space-x-1">
        <FooterLink href="https://www.ed.ac.uk/informatics/blockchain/edi/">
          EDI
        </FooterLink>{" "}
        © 2025 Edinburgh Decentralisation Index.
      </p>
      <ul className="inline-flex justify-center flex-wrap gap-y-1 gap-x-3 text-sm">
        <ListItem>
          <Infograph />
          <FooterLink href={"/infographics"}>Infographics</FooterLink>
        </ListItem>
        <ListItem>
          <CodePoint />
          <FooterLink href="/changelog">Changelog</FooterLink>
        </ListItem>
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
  return <li className="flex items-center gap-1 text-sm">{children}</li>
}

function FooterLink(props: LinkProps) {
  return (
    <Link
      className="transition-colors underline underline-offset-4 hover:text-blue-400"
      {...props}
    />
  )
}
