import { AppLink } from "@/components"
import { CONSENSUS_METHOD_CARD, CONSENSUS_METRICS } from "@/utils"

export function ConsensusMethodology() {
  const explorerLinks = [
    { name: "BitInfoCharts", url: "https://bitinfocharts.com/" },
    { name: "Etherscan", url: "https://etherscan.io/" },
    { name: "Wallet Explorer", url: "https://www.walletexplorer.com/" },
    { name: "Dogecoin Whale Alert", url: "https://dogecoinwhalealert.com/" },
    { name: "TzKT", url: "https://tzkt.io/" },

    { name: "Blockchain.com", url: "https://blockchain.com/" },
    { name: "BTC.com", url: "https://btc.com/" },
    {
      name: "bitcoin-data/mining-pools",
      url: "https://github.com/bitcoin-data/mining-pools"
    },
    {
      name: "btccom/Blockchain-Known-Pools-LTC",
      url: "https://github.com/btccom/Blockchain-Known-Pools-LTC"
    },
    {
      name: "blockchain/Blockchain-Known-Pools",
      url: "https://github.com/blockchain/Blockchain-Known-Pools"
    }
  ]

  const half = Math.ceil(explorerLinks.length / 2)
  const firstColumn = explorerLinks.slice(0, half)
  const secondColumn = explorerLinks.slice(half)

  return (
    <div className="space-y-16 font-roboto">
      {/* Header Image Card with Title */}

      <div className="card w-full bg-base-200 shadow-md overflow-hidden h-48">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-base-content">
            Consensus Methodology
          </h1>
        </div>
        <div className="divider divider-accent"></div>

        <figure>
          <img
            src={CONSENSUS_METHOD_CARD}
            alt="Consensus Methodology"
            className="w-full h-full object-cover opacity-50"
          />
        </figure>
      </div>

      <div className="card w-full bg-base-200 shadow-md overflow-hidden opacity-80">
        <div className="card-body p-4 text-base">
          <p>
            <AppLink href="https://informatics.ed.ac.uk/blockchain/edi">
              The Edinburgh Decentralisation Index (EDI)
            </AppLink>{" "}
            is a methodology framework for defining, analysing, and evaluating
            the decentralisation level of blockchain systems across multiple
            layers. These layers are: Hardware, Software, Network, Consensus,
            Tokenomics, Client API, Governance, and Geography.
          </p>
          <p className="">
            This page offers visualisations of the Consensus layer results. The
            ledgers that are currently supported are: Bitcoin, Bitcoin Cash,
            Cardano, Dogecoin, Ethereum, Litecoin, Tezos, and Zcash.
            Decentralisation is evaluated by applying metrics on the
            distribution of blocks across the entities that produced them.
            Specifically, the following metrics are presented in the dashboard:
            Nakamoto coefficient, Gini coefficient, Shannon entropy,
            Herfindahl-Hirschman index (HHI), Theil index, 1-concentration
            ratio, and the 0.66-tau index. Metric definitions are provided in
            the respective charts.
          </p>
          <p className="">
            Historical block data for each blockchain is collected from{" "}
            <AppLink href="https://console.cloud.google.com/bigquery">
              BigQuery
            </AppLink>{" "}
            and self-hosted full nodes. Each block is mapped to its creator (see
            clustering options below), and then the distribution of blocks
            across entities is calculated for each 30-day interval. Active
            participants are identified by including those that produced at
            least one block in the preceding or following window.
          </p>
          <p className="">
            For detailed information, refer to the open-source GitHub{" "}
            <AppLink href="https://github.com/Blockchain-Technology-Lab/consensus-decentralization">
              repository
            </AppLink>
            .
          </p>
        </div>
      </div>

      <div className="space-y-12 font-roboto">
        <div className="card bg-base-200 shadow-md font-roboto pt-4">
          <div className="card-body p-4">
            <h1 className="text-xl font-bold text-base-content mb-6">
              Metrics
            </h1>

            {CONSENSUS_METRICS.map((metric, index) => {
              const isEven = index % 2 === 0
              return (
                <div
                  key={metric.metric}
                  className="card lg:card-side bg-base-100 shadow-sm mb-4"
                >
                  {isEven && (
                    <figure className="lg:w-1/2">
                      <img src={`${metric.icon}`} alt={metric.title} />
                    </figure>
                  )}

                  <div className="card-body">
                    <h2 className="card-title">{metric.title}</h2>
                    <p>{metric.description}</p>
                  </div>

                  {!isEven && (
                    <figure className="lg:w-1/2">
                      <img src={`${metric.icon}`} alt={metric.title} />
                    </figure>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-12 font-roboto">
        <div className="card bg-base-200 shadow-md font-roboto pt-4">
          <div className="card-body p-4 ">
            <h1 className="text-2xl font-bold  text-base-content">
              Consensus Layer - Clustering Options
            </h1>
          </div>
          <div className="divider divider-accent"></div>
          <div className="card-body p-4 text-base">
            <p className="">
              A user can choose which off-chain sources to use to attribute
              blockchain data to real world entities. This enables the
              clustering of seemingly independent objects under the same
              identity. On the consensus layer, clustering helps to attribute
              multiple blocks to the same producer, like a mining pool.
            </p>
            <p className="">
              For Consensus, the clustering options are: “Explorers”, “On-chain
              metadata”, and “None”. “Explorers” refers to attribution and
              deanonymisation data collected from:
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-between p-2">
              <ul className="list bg-base-100 rounded-box shadow-md flex-1">
                {firstColumn.map((link) => (
                  <li className="list-row" key={link.url}>
                    <div>
                      <div>{link.name}</div>
                      <AppLink href={link.url}>{link.url}</AppLink>
                    </div>
                  </li>
                ))}
              </ul>
              <ul className="list bg-base-100 rounded-box shadow-md flex-1">
                {secondColumn.map((link) => (
                  <li className="list-row" key={link.url}>
                    <div>
                      <div>{link.name}</div>
                      <AppLink href={link.url}>{link.url}</AppLink>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="">
              <span className="prose-quote italic underline">
                On-chain metadata
              </span>{" "}
              refers to self-identifying information, such as name and website,
              that consensus participants publish on-chain.
            </p>
            <p className="">
              Explorer data is used for all ledgers except Cardano, whereas
              on-chain metadata are used only for Cardano.
            </p>
            <p className="">
              A user can choose either “None” or any combination of the other
              options.
            </p>
            <p className="">By default, all clustering options are applied.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
