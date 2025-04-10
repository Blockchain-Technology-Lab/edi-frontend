import { useEffect, useState } from "react"
import { Card, DoughnutChartRenderer, LineChart } from "@/components"

import {
  DataEntry,
  NETWORK_CSV,
  getNetworkDoughnutCsvFileName,
  getNetworkNodesCsvFileName,
  getNetworkOrganizationsCsvFileName,
  loadNetworkNodesCsvData,
  loadNetworkOrganizationsCsvData
} from "@/utils"

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
  "bitcoin",
  "bitcoin_cash",
  "dogecoin",
  "litecoin",
  "zcash"
]

export default function NetworkPage() {
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
    <section className="flex flex-col gap-12">
      <Card title="Network Layer" titleAppearance="xl">
        <p>
          These graphs represent the network decentralisation. Each metric value
          is calculated based on the distribution of nodes across organisations.
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
        />
      </Card>
      <Card title="1-concentration Ratio">
        <p>
          The 1-concentration ratio represents the share of nodes that are owned
          by the single most “powerful” entity, i.e. the entity that owns the
          most nodes.
        </p>
        <LineChart
          metric="max_power_ratio"
          type="network"
          csvData={orgData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>
      <Card title="Organizations">
        <p>
          These graphs represent the distribution of nodes between
          organisations. Regarding the Bitcoin network, more than half of the
          nodes use Tor, and it is impossible to know which organisations own
          them. For the metrics shown below, it was therefore decided to
          distribute these nodes proportionally among the different
          organisations.
        </p>
        {DOUGHNUT_LEDGERS.map((ledger) => (
          <Card key={ledger} title={ledger} titleAppearance="lg">
            <DoughnutChartRenderer
              path={`${NETWORK_CSV}${getNetworkDoughnutCsvFileName(ledger)}`}
              fileName={ledger}
            />
          </Card>
        ))}
      </Card>
    </section>
  )
}
