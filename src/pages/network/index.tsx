import { useEffect, useState } from "react"
import { Card, LineChart } from "@/components"
import { NETWORK_CSV } from "@/utils"
import type { DataEntry } from "@/utils"
import {
  getNetworkNodesCsvFileName,
  getNetworkOrganizationsCsvFileName,
  loadNetworkNodesCsvData,
  loadNetworkOrganizationsCsvData
} from "@/utils/network"

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
          Decentralization metrics based on node count & organization mapping.
        </p>
      </Card>

      <Card title="Number of Nodes">
        <LineChart
          metric="number_nodes"
          type="network"
          csvData={nodesData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>

      <Card title="HHI">
        <LineChart
          metric="hhi"
          type="network"
          csvData={orgData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>
      <Card title="Nakamoto Coefficient">
        <LineChart
          metric="nakamoto_coefficient"
          type="network"
          csvData={orgData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>
      <Card title="Max Power Ratio">
        <LineChart
          metric="max_power_ratio"
          type="network"
          csvData={orgData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>
    </section>
  )
}
