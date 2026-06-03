import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
import { AppLink } from '@/components'

export function AboveFooter() {
  return (
    <div className="bg-base-200/60 border-t border-base-300 px-4 sm:px-6 py-3">
      <div className="flex items-start gap-2.5">
        <FontAwesomeIcon
          icon={faCircleInfo}
          className="h-4 w-4 text-base-content/35 mt-0.5 flex-shrink-0"
        />
        <p className="text-[10px] leading-relaxed text-base-content/70">
          The{' '}
          <AppLink href="https://informatics.ed.ac.uk/blockchain/edi">
            Edinburgh Decentralisation Index (EDI)
          </AppLink>{' '}
          is a research project run by the University of Edinburgh's Blockchain
          Technology Laboratory (
          <AppLink href="https://informatics.ed.ac.uk/blockchain">
            BTL
          </AppLink>{' '}
          —{' '}
          <AppLink href="https://informatics.ed.ac.uk/blockchain">
            blockchain.ed.ac.uk
          </AppLink>
          ). The index adheres to the university's highest academic standards
          and relies on novel and peer-reviewed research on measuring
          decentralisation published at top-tier cryptography and cyber security
          conferences (
          <AppLink
            href="https://informatics.ed.ac.uk/blockchain/edi/publications"
            className="inline-flex items-center gap-0.5"
          >
            publications
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="h-2 w-2"
            />
          </AppLink>
          ). The funding for the project came from Input Output Group (IOG) as
          well as internal university grants. We gratefully acknowledge these
          funding sources while emphasising that the direction of the research
          and its outcomes were not influenced in any way by any partner of the
          BTL.
        </p>
      </div>
    </div>
  )
}
