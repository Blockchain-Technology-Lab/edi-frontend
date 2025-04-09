import { useEffect, useState } from "react"
import { Card, LineChart } from "@/components"
import {
  getNetworkCsvFileName,
  NETWORK_CSV,
  DataEntry,
  loadNetworkCsvData
} from "@/utils"

const ledgers = [
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
      setLoading(true)
      try {
        const nodes: DataEntry[] = []
        const orgs: DataEntry[] = []

        // 1. Load bitcoin (original) for nodes
        const bitcoinNodesPath = `${NETWORK_CSV}${getNetworkCsvFileName(
          "nodes",
          "bitcoin"
        )}`
        const bitcoinNodeData = await loadNetworkCsvData(
          bitcoinNodesPath,
          "nodes"
        )
        nodes.push(...bitcoinNodeData)

        // 2. Load ledgers for both nodes and organizations
        for (const ledger of ledgers) {
          if (ledger !== "bitcoin_without_tor") {
            // load normal nodes file
            const nodesPath = `${NETWORK_CSV}${getNetworkCsvFileName(
              "nodes",
              ledger
            )}`
            const nodeData = await loadNetworkCsvData(nodesPath, "nodes")
            nodes.push(...nodeData)
          }

          // load organizations file
          const orgPath = `${NETWORK_CSV}${getNetworkCsvFileName(
            "organizations",
            ledger
          )}`
          const orgDataForLedger = await loadNetworkCsvData(
            orgPath,
            "organizations",
            ledger === "bitcoin_without_tor" ? "bitcoin" : undefined // rename ledger for chart labels
          )
          orgs.push(...orgDataForLedger)
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

      <Card title="Organizations">
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
      </Card>
    </section>
  )
}
