import { GOVERNANCE_CARD } from "@/utils"

export function GovernanceMethodology() {
  return (
    <div className="space-y-16 font-roboto">
      {/* Header Image Card with Title */}
      <div className="card w-full bg-base-200 shadow-md overflow-hidden h-48">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-base-content">
            Governance Methodology
          </h1>
        </div>
        <div className="divider divider-accent"></div>

        <figure>
          <img
            src={GOVERNANCE_CARD}
            alt="Governance Methodology"
            className="w-full h-full object-cover opacity-50"
          />
        </figure>
      </div>
      <div className="card w-full bg-base-200 shadow-md overflow-hidden opacity-80">
        <div className="card-body p-4 text-base">
          <p>
            <a
              href="https://informatics.ed.ac.uk/blockchain/edi"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              The Edinburgh Decentralisation Index (EDI)
            </a>{" "}
            is a comprehensive methodology framework for defining, analyzing,
            and evaluating the decentralization level of blockchain systems
            across multiple layers. These layers include: Hardware, Software,
            Network, Consensus, Tokenomics, Client API, Governance, and
            Geography.
          </p>

          <p>
            This dashboard offers visualizations of the Governance layer
            results. This layer is evaluated by scraping discussions about
            blockchain governance decisions from mailing lists, social media
            platforms, and online forums. The goal is to apply social network
            analysis theories to understand how "influence" is distributed
            across participants in governance processes.
          </p>

          <p>
            The dashboard currently provides results for Bitcoin off-chain
            governance based on data collected from the official Bitcoin Forum
            website. We scraped BIP-related discussions (extract all posts
            maintaining BIP IDs, and all associated comments under these posts),
            extracting user reply interactions. This data was then processed to
            create network graphs using NetworkX, where nodes represent forum
            users and edges represent direct interactions through comments.
          </p>

          <p>
            The dashboard presents key metrics include participation
            distribution analysis showing the concentration of activity among
            top contributors, yearly Gini coefficients tracking equality in user
            engagement over time, community detection results with modularity
            scores that assess whether discussions form isolated echo chambers
            or maintain cross-community dialogue across the governance network.
          </p>
          <p>
            We employ the Louvain community detection method to identify
            distinct groups within the governance network. The modularity score
            measures how well the network divides into separate communities,
            with higher modularity values indicating stronger community
            structure. This time-series exploration analysis reveals whether
            governance discussions are fragmented into isolated echo chambers or
            maintain cross-community dialogue.
          </p>
        </div>
      </div>
    </div>
  )
}
