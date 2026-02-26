import { AppLink } from '@/components'
import { CONSENSUS_METHOD_CARD } from '@/utils'

export function SoftwareMethodology() {
  const cryptoNodes = [
    {
      name: 'Bitcoin Core',
      symbol: 'Bitcoin',
      href: 'https://github.com/bitcoin/bitcoin'
    },
    {
      name: 'Bitcoin Cash Node',
      symbol: 'Bitcoin Cash',
      href: 'https://github.com/bitcoin-cash-node/bitcoin-cash-node'
    },
    {
      name: 'Cardano Node',
      symbol: 'Cardano',
      href: 'https://github.com/IntersectMBO/cardano-node'
    },
    {
      name: 'Go Ethereum',
      symbol: 'Ethereum',
      href: 'https://github.com/ethereum/go-ethereum'
    },
    {
      name: 'Nethermind',
      symbol: 'Ethereum',
      href: 'https://github.com/NethermindEth/nethermind'
    },
    {
      name: 'Litecoin Core',
      symbol: 'Litecoin',
      href: 'https://github.com/litecoin-project/litecoin'
    },
    {
      name: 'Polkadot SDK',
      symbol: 'Polkadot',
      href: 'https://github.com/paritytech/polkadot-sdk'
    },
    {
      name: 'Solana',
      symbol: 'Solana',
      href: 'https://github.com/solana-labs/solana'
    },
    {
      name: 'Tezos',
      symbol: 'Tezos',
      href: 'https://github.com/tezos/tezos-mirror'
    },
    { name: 'Zcash', symbol: 'Zcash', href: 'https://github.com/zcash/zcash' }
  ]

  return (
    <div className="space-y-16 font-roboto">
      {/* Header Image Card with Title */}

      <div className="card w-full bg-base-200 shadow-md overflow-hidden h-48">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-base-content">
            Software Methodology
          </h1>
        </div>
        <div className="divider divider-accent"></div>

        <figure>
          <img
            src={CONSENSUS_METHOD_CARD}
            alt="Software Methodology"
            className="w-full h-full object-cover opacity-50"
          />
        </figure>
      </div>

      <div className="card w-full bg-base-200 shadow-md overflow-hidden opacity-80">
        <div className="card-body p-4 text-base">
          <p>
            <AppLink href="https://informatics.ed.ac.uk/blockchain/edi">
              The Edinburgh Decentralisation Index (EDI)
            </AppLink>{' '}
            is a methodology framework for defining, analysing, and evaluating
            the decentralisation level of blockchain systems across multiple
            layers. These layers are: Hardware, Software, Network, Consensus,
            Tokenomics, Client API, Governance, and Geography.
          </p>
          <p className="">
            This page offers visualisations of the Software layer results. This
            layer is evaluated by looking at the open source repositories that
            are associated with different blockchain clients, and specifically
            looking at their commit history. The dashboard currently provides
            results for the following projects:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            {cryptoNodes.map((node) => (
              <li key={node.href}>
                <AppLink
                  href={node.href}
                  className="link link-accent font-light "
                  target="_blank"
                >
                  {node.name}{' '}
                  <span className="text-sm text-gray-400">({node.symbol})</span>
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-12 font-roboto">
        <div className="card bg-base-200 shadow-md font-roboto pt-4">
          <div className="card-body p-4">
            <h1 className="text-xl font-bold text-base-content mb-6">
              Software layer - Options
            </h1>
            <div className="divider divider-accent"></div>
            <p>
              A user can choose which options will be taken into account when
              generating the graphs. These include:
            </p>
            <ul className="list-unstyled">
              <li>
                <strong>Sample Window</strong>, i.e. how many consecutive
                commits to group together before applying a metric. It can be
                one of: 100, 250, 500, 1000.
              </li>
              <li>
                <strong>Contribution Type</strong>, i.e. what counts as a
                contribution. The options are:
                <ul className="list-unstyled ms-4">
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
                      removed) counts as a contribution. In this case, all
                      commits are counted, but each is assigned a different
                      contribution weight, based on the number of updated lines
                      associated with it.
                    </i>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Contributor Type</strong>, i.e. who is seen as
                responsible for the contribution. Author: the person who wrote
                the code of the commit. Committer: the person who committed the
                code on behalf of the original author (can be the same or
                different from the author).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
