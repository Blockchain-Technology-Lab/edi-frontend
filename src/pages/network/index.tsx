import { useEffect, useState } from "react"
import { Card, LineChart, ToggleSwitch } from "@/components"
import {
  getNetworkCsvFileName,
  NETWORK_CSV,
  DataEntry,
  loadNetworkCsvData
} from "@/utils"
import { useWithoutTorToggle } from "@/hooks"

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

  const { showWithoutTor, handleToggle } = useWithoutTorToggle()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const nodes: DataEntry[] = []
        const orgs: DataEntry[] = []

        const activeLedgers = ledgers.filter((l) => {
          if (showWithoutTor) return l.ledger !== "bitcoin"
          return l.ledger !== "bitcoin_without_tor"
        })

        const bitcoinLedger = showWithoutTor
          ? {
              ledger: "bitcoin_without_tor",
              overrideName: "bitcoin_without_tor"
            }
          : { ledger: "bitcoin", overrideName: undefined }

        for (const { ledger, overrideName } of [
          ...activeLedgers,
          bitcoinLedger
        ]) {
          if (ledger !== "bitcoin_without_tor") {
            const nodesFile = getNetworkCsvFileName("nodes", ledger)
            const nodesPath = `${NETWORK_CSV}${nodesFile}`
            const n = await loadNetworkCsvData(nodesPath, "nodes", overrideName)
            nodes.push(...n)
          }

          const orgFile = getNetworkCsvFileName("organizations", ledger)
          const orgPath = `${NETWORK_CSV}${orgFile}`
          const o = await loadNetworkCsvData(
            orgPath,
            "organizations",
            overrideName
          )
          orgs.push(...o)
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
  }, [showWithoutTor])

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
        <div className="flex justify-end mb-4">
          <ToggleSwitch
            label="Show without Tor"
            checked={showWithoutTor}
            onChange={handleToggle}
          />
        </div>
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
