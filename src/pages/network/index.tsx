import { useEffect, useRef, useState } from "react"
import {
  Card,
  DoughnutChartRenderer,
  LineChart,
  Link,
  useScroll
} from "@/components"

import {
  DataEntry,
  NETWORK_CSV,
  getNetworkDoughnutCsvFileName,
  getNetworkNodesCsvFileName,
  getNetworkOrganizationsCsvFileName,
  loadNetworkNodesCsvData,
  loadNetworkOrganizationsCsvData
} from "@/utils"
import { useRouter } from "next/router"

const NODE_LEDGERS = [
  "bitcoin",
  "bitcoin_cash",
  "dogecoin",
  "litecoin",
  "zcash"
]
const ORG_LEDGERS = [
  "bitcoin_without_tor",
  "bitcoin_cash",
  "dogecoin",
  "litecoin",
  "zcash"
]

const DOUGHNUT_LEDGERS = [
  { chain: "bitcoin", name: "Bitcoin" },
  { chain: "bitcoin_cash", name: "Bitcoin Cash" },
  { chain: "dogecoin", name: "Dogecoin" },
  { chain: "litecoin", name: "Litecoin" },
  { chain: "zcash", name: "ZCash" }
]

export default function NetworkPage() {
  const { asPath } = useRouter()
  const router = useRouter()
  const { registerRef, scrollToSection } = useScroll()

  const topRef = useRef<HTMLDivElement>(null)
  const doughnutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && asPath.includes("#")) {
      const [, hash] = asPath.split("#")
      setTimeout(() => scrollToSection(hash), 100)
    } else {
      // fallback when no hash: scroll to top explicitly
      setTimeout(() => scrollToSection("top"), 100)
    }
    registerRef("top", topRef)
    registerRef("doughnut", doughnutRef)
  }, [asPath, registerRef, scrollToSection])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!url.includes("#")) {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  const [nodesData, setNodesData] = useState<DataEntry[]>([])
  const [orgData, setOrgData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const nodes: DataEntry[] = []
        const orgs: DataEntry[] = []

        for (const ledger of NODE_LEDGERS) {
          const file = getNetworkNodesCsvFileName(ledger)
          const path = `${NETWORK_CSV}${file}`
          const data = await loadNetworkNodesCsvData(path)

          nodes.push(...data)
        }

        for (const ledger of ORG_LEDGERS) {
          const file = getNetworkOrganizationsCsvFileName(ledger)
          const path = `${NETWORK_CSV}${file}`
          const data = await loadNetworkOrganizationsCsvData(path)
          orgs.push(...data)
        }

        setNodesData(nodes)
        setOrgData(orgs)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <section ref={topRef} id="top" className="flex flex-col gap-12">
      <Card title="Network Layer" titleAppearance="xl">
        <p>
          These graphs represent the network decentralisation. The results are
          based only on data we have collected and do not include any historical
          data. <Link href="/network/methodology">Read more...</Link>
        </p>
      </Card>

      <Card title="Number of Nodes">
        <p>The following graph represents the number of nodes over time.</p>
        <LineChart
          metric="number_nodes"
          type="network"
          csvData={nodesData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>

      <Card title="Organisations metrics">
        <p>
          The following graphs represent different metrics concerning the
          distribution of nodes across organisations. Regarding the Bitcoin
          network, more than half of the nodes use Tor (see{" "}
          <Link href="#doughnut">Organisations Distribution</Link> ), and it is
          impossible to know which organisations own them. For the metrics shown
          below, it was therefore decided to distribute these nodes
          proportionally among the different organisations.
        </p>
      </Card>

      <Card title="HHI">
        <p>
          The Herfindahl-Hirschman Index (HHI) is a measure of market
          concentration. It is defined as the sum of the squares of the market
          shares (as whole numbers, e.g. 40 for 40%) of the entities in the
          system. Values close to 0 indicate low concentration (many
          organisations own a similar number of nodes) and values close to
          10,000 indicate high concentration (one organisation controls most or
          all nodes).
        </p>
        <LineChart
          metric="hhi"
          type="network"
          csvData={orgData}
          isLoadingCsvData={loading}
          timeUnit="day"
          tooltipDecimals={0}
        />
      </Card>
      <Card title="Nakamoto Coefficient">
        <p>
          The Nakamoto coefficient represents the minimum number of entities
          that collectively control more than 50% of the resources (in this
          case, the majority of nodes).
        </p>
        <LineChart
          metric="nakamoto_coefficient"
          type="network"
          csvData={orgData}
          isLoadingCsvData={loading}
          timeUnit="day"
          padYAxis={true}
        />
      </Card>
      <Card title="1-concentration Ratio">
        <p>
          The 1-concentration ratio represents the share of nodes that are owned
          by the single most &quot;powerful&quot; entity, i.e. the entity that
          owns the most nodes.
        </p>
        <LineChart
          metric="max_power_ratio"
          type="network"
          csvData={orgData}
          isLoadingCsvData={loading}
          timeUnit="day"
          tooltipDecimals={2}
        />
      </Card>
      <div ref={doughnutRef} id="doughnut">
        <div className="mb-4">
          <Card title="Organisations Distribution">
            <p>
              The following pie charts represent the distribution of nodes
              across organisations.
            </p>
          </Card>
        </div>

        {DOUGHNUT_LEDGERS.map((ledger, index) => (
          <div className="mb-4" key={index}>
            <Card key={index} title={ledger.name} titleAppearance="lg">
              <DoughnutChartRenderer
                path={`${NETWORK_CSV}${getNetworkDoughnutCsvFileName(ledger.chain)}`}
                fileName={ledger.chain}
              />
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}
