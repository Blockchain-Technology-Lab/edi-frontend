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
          Here, the clustering options are: &quot;Explorers&quot;, &quot;Staking
          keys&quot;, &quot;Multi-input Transactions&quot;, &quot;Crystal
          Intelligence&quot; and &quot;None&quot;. A user can choose either
          &quot;None&quot; or any combination of the other options.
          &quot;Explorers&quot; refers to attribution and deanonymization data
          collected from blockchain explorers, namely{" "}
          <Link href="https://bitinfocharts.com/">BitInfoCharts</Link>,{" "}
          <Link href="https://etherscan.io/">Etherscan</Link>,{" "}
          <Link href="https://www.walletexplorer.com/">Wallet Explorer</Link>,{" "}
          <Link href="https://dogecoinwhalealert.com/">
            Dogecoin Whale Alert
          </Link>
          , <Link href="https://tzkt.io/">TzKT</Link>.
        </p>
        <p>
          &quot;Staking keys&quot; refers to the data collected from stake pools
          and validators that are used to attribute staking addresses to the
          same entity.
        </p>
        <p>
          We have now added the &apos;Multi-input Transactions&apos; clustering
          option. This feature allows attributing addresses to the same entity
          when they are used as inputs in the same transaction, a
          well-established heuristic for clustering addresses in UTXO-based
          ledgers.
        </p>
        <p>
          Explorer data is used for all ledgers except Cardano, whereas staking
          keys are used only for Cardano.
        </p>
        <p>
          Additionally, we have introduced a new third-party clustering option
          called &quot;Crystal Intelligence&quot;. This option leverages
          advanced clustering algorithms from{" "}
          <Link href="https://crystalintelligence.com/">
            {" "}
            Crystal Intelligence & Crypto Compliance
          </Link>{" "}
          to more accurately group public addresses belonging to the same
          real-world entity. Unlike the other clustering methods, which are
          developed in-house, &quot;Crystal Intelligence&quot; is an external
          integration. You can select &quot;Crystal Intelligence&quot;
          individually or in combination with our other clustering methods in
          the Clustering options.
        </p>
        <p>By default, all options (except &quot;None&quot;) are applied.</p>
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
          For example, if the option &quot;Top 100&quot; is chosen on the
          Tokenomics layer, then the metrics will apply on the top 100 richest
          entities in the system, while ignoring the rest. Similarly, if the
          option &quot;Above $0.01&quot; is chosen in Tokenomics, the metrics
          will apply on entities that control tokens that were worth, at the
          given point in time, at least $0.01.
        </p>
        <p>
<<<<<<< HEAD
          Thresholding options are: &quot;Top 100&quot;, &quot;Top 1000&quot;,
          &quot;Top 50%&quot;, &quot;Above $0.01&quot;, &quot;None&quot;.
=======
          Threshold options are: “Top 100”, “Top 1000”, “Top 50%”, “Above
          $0.01”, “None”.
>>>>>>> main
        </p>
        <p>By default, no inclusion threshold is applied.</p>
      </Card>
    </section>
  )
}
