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
          Client API, Governance, and Geography.
        </p>
        <p>
          This dashboard offers visualizations of the results for the Consensus
          and Tokenomics layers. The ledgers that are currently supported are:
          Bitcoin, Bitcoin Cash, Cardano, Ethereum, Litecoin, and Tezos. On the
          Consensus layer, decentralization is evaluated by applying metrics on
          the distribution of blocks across the entities that produced them. On
          the Tokenomics layer, it is the distribution of tokens across token
          holders that guides the results. The blockchain data that is needed to
          determine these distributions are collected from{" "}
          <Link href="https://console.cloud.google.com/bigquery">BigQuery</Link>{" "}
          and self-hosted full nodes. For more information on how data is
          processed you can refer to the documentation of the open-source GitHub
          repositories for the{" "}
          <Link href="https://github.com/Blockchain-Technology-Lab/consensus-decentralization">
            Consensus
          </Link>{" "}
          and{" "}
          <Link href="https://blockchain-technology-lab.github.io/tokenomics-decentralization/">
            Tokenomics
          </Link>{" "}
          layers. The dashboard offers various options to the users for
          customizing the results.
        </p>
      </Card>
      <Card title="Tokenomics layer - Clustering options" titleAppearance="lg">
        <p>
          A user can choose which off-chain sources to use to attribute
          blockchain data to real world entities. This enables the clustering of
          seemingly independent objects under the same identity.On the
          Tokenomics layer, clustering enables the attribution of multiple
          independent addresses to the same wallet.
        </p>
        <p>
          Here, the clustering options are: “Explorers”, “Staking keys”, and
          “None”. A user can choose either “None” or any combination of the
          other options. “Explorers” refers to attribution and deanonymization
          data collected from blockchain explorers, namely{" "}
          <Link href="https://bitinfocharts.com/">BitInfoCharts</Link>,{" "}
          <Link href="https://etherscan.io/">Etherscan</Link>,{" "}
          <Link href="https://www.walletexplorer.com/">Wallet Explorer</Link>,{" "}
          <Link href="https://dogecoinwhalealert.com/">
            Dogecoin Whale Alert
          </Link>
          , <Link href="https://tzkt.io/">TzKT</Link>.
        </p>
        <p>
          “Staking keys” refers to the data collected from stake pools and
          validators that are used to attribute staking addresses to the same
          entity.
        </p>
        <p>
          In the future, one more clustering option will be added, namely
          “Multi-input transactions”. This option will enable attributing to the
          same entity addresses that are used as input in the same transaction,
          which is a known heuristic for clustering addresses in UTXO-based
          ledgers.
        </p>
        <p>
          Explorer data is used for all ledgers except Cardano, whereas staking
          keys are used only for Cardano.
        </p>
        <p>By default, all options (except “None”) are applied.</p>
      </Card>
      <Card
        title="Tokenomics layer - Thresholding options"
        titleAppearance="lg"
      >
        <p>
          A user can apply the decentralization metrics on all or part of the
          data by choosing the relevant inclusion threshold on each layer.
        </p>
        <p>
          For example, if the option “Top 100” is chosen on the Tokenomics
          layer, then the metrics will apply on the top 100 richest entities in
          the system, while ignoring the rest. Similarly, if the option “Above
          $0.01” is chosen in Tokenomics, the metrics will apply on entities
          that control tokens that were worth, at the given point in time, at
          least $0.01.
        </p>
        <p>
          Threshold options are: “Top 100”, “Top 1000”, “Top 50%”, “Above
          $0.01”, “None”.
        </p>
        <p>By default, Top 1000 thresholding is applied.</p>
      </Card>
    </section>
  )
}
