import { Card, Link } from "@/components"

export default function MethodologyPage() {
  return (
    <section className="flex flex-col gap-12">
      <Card title="Methodology" titleAs="h1" titleAppearance="xl">
        <p>
          <Link href="https://informatics.ed.ac.uk/blockchain/edi">
            The Edinburgh Decentralization Index (EDI)
          </Link>{" "}
          is a methodology framework for defining, analyzing, and evaluating the
          decentralization level of blockchain systems across multiple layers.
          These layers are: Hardware, Software, Network, Consensus, Tokenomics,
          Client API, Governance, and Geography. This dashboard offers
          visualizations of results from the Consensus, Tokenomics and Software
          layers.
        </p>
        <p>
          The Software layer is evaluated by looking at the open source
          repositories that are associated with different blockchain clients,
          and specifically looking at their commit history. The dashboard
          currently provides results for the following projects:
        </p>

        <ul>
          <li>
            <Link
              href="https://github.com/bitcoin/bitcoin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bitcoin Core (Bitcoin)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/bitcoin-cash-node/bitcoin-cash-node"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bitcoin Cash Node (Bitcoin Cash)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/IntersectMBO/cardano-node"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cardano Node (Cardano)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/ethereum/go-ethereum"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go Ethereum (Ethereum)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/NethermindEth/nethermind"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nethermind (Ethereum)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/litecoin-project/litecoin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Litecoin Core (Litecoin)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/paritytech/polkadot-sdk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Polkadot SDK (Polkadot)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/solana-labs/solana"
              target="_blank"
              rel="noopener noreferrer"
            >
              Solana (Solana)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/tezos/tezos-mirror"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tezos (Tezos)
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/zcash/zcash"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zcash (Zcash)
            </Link>
          </li>
        </ul>
      </Card>
      <Card title="Software layer - Options" titleAppearance="lg">
        <p>
          A user can choose which options will be taken into account when
          generating the graphs. These include:
        </p>
        <ul>
          <li>
            <b>Sample Window</b>, i.e. how many consecutive commits to group
            together before applying a metric. It can be one of: 100, 250, 500,
            1000.
          </li>
          <li>
            <b>Contribution Type</b>, i.e. what counts as a contribution. The
            options are:
            <ul>
              <li>
                <i>
                  Number of commits: each commit is counted as a single
                  contribution.
                </i>
              </li>
              <li>
                <i>
                  Number of merge commits: only merge commits are counted as
                  contributions.
                </i>
              </li>
              <li>
                <i>
                  Lines of code changed: each line of code changed (added or
                  removed) counts as a contribution. In this case, all commits
                  are counted, but each is assigned a different contribution
                  weight, based on the number of updated lines associated with
                  it.
                </i>
              </li>
            </ul>
          </li>
          <li>
            <b>Contributor Type</b>, i.e. who is seen as responsible for the
            contribution. Author: the person who wrote the code of the commit.
            Committer: the person who committed the code on behalf of the
            original author (can be the same or different from the author).
          </li>
        </ul>
      </Card>
    </section>
  )
}
