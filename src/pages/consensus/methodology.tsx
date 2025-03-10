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
          This dashboard offers visualizations of the Consensus layer results. 
          The ledgers that are currently supported are:
          Bitcoin, Bitcoin Cash, Cardano, Dogecoin, Ethereum, Litecoin, Tezos, and Zcash. 
          Decentralization is evaluated by applying metrics on
          the distribution of blocks across the entities that produced them.
          Specifically, the following metrics are presented in the dashboard:
          Nakamoto coefficient, Gini coefficient, Shannon entropy, Herfindahl-Hirschman index (HHI),
          Theil index, 1-concentration ratio, and the 0.66-tau index. 
          Metric definitions are provided in the respective charts.

          Historical block data for each blockchain is collected from{" "}
          <Link href="https://console.cloud.google.com/bigquery">BigQuery</Link>{" "}
          and self-hosted full nodes. 
          Each block is mapped to its creator (see clustering options below) and then 
          the distribution of blocks across entities is calculated for each 30-day interval
          of the observation period.

          For certain metrics, such as the Gini coefficient, it is important to include all entities
          that were active during some time period, even if they did not succeed in producing any blocks.
          For this reason, when estimating the active participants in a given 30-day window, we consider 
          an to be active if it produced at least one block in the preceding or following 30-day window.
          
          For detailed information on how the data is
          processed you can refer to the documentation of the relevant open-source GitHub
          {" "}
          <Link href="https://github.com/Blockchain-Technology-Lab/consensus-decentralization">
          repository
          </Link>{" "}
          .           
        </p>
      </Card>
      <Card title="Consensus layer - Clustering options" titleAppearance="lg">
        <p>
          A user can choose which off-chain sources to use to attribute
          blockchain data to real world entities. This enables the clustering of
          seemingly independent objects under the same identity. On the
          consensus layer, clustering helps to attribute multiple blocks to the
          same producer, like a mining pool.
        </p>
        <p>
          For Consensus, the clustering options are: “Explorers”, “On-chain
          metadata”, and “None”. “Explorers” refers to attribution and
          deanonymization data collected from blockchain explorers, namely{" "}
          <Link href="https://bitinfocharts.com/">BitInfoCharts</Link>,{" "}
          <Link href="https://etherscan.io/"> Etherscan</Link>,{" "}
          <Link href="https://www.walletexplorer.com/">Wallet Explorer</Link>,{" "}
          <Link href="https://dogecoinwhalealert.com/">
            Dogecoin Whale Alert
          </Link>
          , <Link href="https://tzkt.io/">TzKT</Link>,
          <Link href="https://blockchain.com/"> Blockchain.com</Link>,{" "}
          <Link href="https://btc.com/">BTC.com</Link>, and the GitHub projects{" "}
          <Link href="https://github.com/bitcoin-data/mining-pools">
            bitcoin-data/mining-pools
          </Link>
          ,{" "}
          <Link href="https://github.com/btccom/Blockchain-Known-Pools-LTC">
            btccom/Blockchain-Known-Pools-LTC{" "}
          </Link>
          ,{" "}
          <Link href="https://github.com/blockchain/Blockchain-Known-Pools">
            blockchain/Blockchain-Known-Pools
          </Link>
          .
        </p>
        <p>
          “On-chain metadata” refers to self-identifying information, such as
          name and website, that consensus participants publish on-chain.
        </p>
        <p>
          Explorer data is used for all ledgers except Cardano, whereas on-chain
          metadata are used only for Cardano.
        </p>
        <p>
          A user can choose either “None” or any combination of the other
          options.
        </p>
        <p>By default, all clustering options are applied.</p>
      </Card>
    </section>
  )
}
