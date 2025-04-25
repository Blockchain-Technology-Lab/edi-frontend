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
          This dashboard offers visualizations of the Network layer results. The
          ledgers that are currently supported are: Bitcoin, Bitcoin Cash,
          Litecoin, Dogecoin and Zcash. On the Network layer, decentralization
          is evaluated based on the distribution of nodes across organizations.
          The blockchain data that is needed to determine these distributions
          are collected using a crawler running on each network. The crawler is
          based on the{" "}
          <Link href="https://github.com/ayeowch/bitnodes">Bitnodes</Link>{" "}
          project. The following metrics are presented in the dashboard: the
          Herfindahl-Hirschman index (HHI), the Nakamoto coefficient and the
          1-concentration ratio. The results are based only on data we have
          collected and do not include any historical data.
        </p>
      </Card>
    </section>
  )
}
