import { useEffect, useState } from "react"
import { Card, LineChart } from "@/components"
import { useNetworkCsvLoader } from "@/hooks"
import {
  getNetworkCsvFileName,
  NETWORK_CSV,
  DataEntry,
  loadNetworkCsvData
} from "@/utils"

const ledgers = [
  { ledger: "bitcoin", overrideName: undefined },
  { ledger: "bitcoin_without_tor", overrideName: "bitcoin_without_tor" },
  { ledger: "bitcoin_cash", overrideName: undefined },
  { ledger: "dogecoin", overrideName: undefined },
  { ledger: "litecoin", overrideName: undefined },
  { ledger: "zcash", overrideName: undefined }
]

export default function NetworkPage() {
  const [nodesData, setNodesData] = useState<DataEntry[]>([])
  const [orgData, setOrgData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const allNodesData: DataEntry[] = []
        const allOrgData: DataEntry[] = []

        for (const { ledger, overrideName } of ledgers) {
          // Only include ledgers that have number_nodes CSVs
          if (ledger !== "bitcoin_without_tor") {
            const nodesFile = getNetworkCsvFileName("nodes", ledger)
            const nodesPath = `${NETWORK_CSV}${nodesFile}`
            const nodes = await loadNetworkCsvData(
              nodesPath,
              "nodes",
              overrideName
            )
            allNodesData.push(...nodes)
          }

          // Load organizations data (has _without_tor)
          const orgFile = getNetworkCsvFileName("organizations", ledger)
          const orgPath = `${NETWORK_CSV}${orgFile}`
          const orgs = await loadNetworkCsvData(
            orgPath,
            "organizations",
            overrideName
          )
          allOrgData.push(...orgs)
        }

        setNodesData(allNodesData)
        setOrgData(allOrgData)
      } catch (err) {
        setError((err as Error).message)
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
          isLoadingCsvData={false}
          timeUnit="day"
        />
      </Card>

      <Card title="Organizations">
        <Card title="HHI">
          <LineChart
            metric="hhi"
            type="network"
            csvData={orgData}
            isLoadingCsvData={false}
            timeUnit="day"
          />
        </Card>

        <Card title="Nakamoto Coefficient">
          <LineChart
            metric="nakamoto_coefficient"
            type="network"
            csvData={orgData}
            isLoadingCsvData={false}
            timeUnit="day"
          />
        </Card>
        <Card title="Max Power Ratio">
          <LineChart
            metric="max_power_ratio"
            type="network"
            csvData={orgData}
            isLoadingCsvData={false}
            timeUnit="day"
          />
        </Card>
      </Card>
    </section>
  )
}
