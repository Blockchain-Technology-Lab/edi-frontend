import { Card, LineChart } from "@/components"
import { useNetworkCsvLoader } from "@/hooks"
import { getNetworkCsvFileName, NETWORK_CSV } from "@/utils"

const ledgers = [
  { ledger: "bitcoin", overrideName: undefined },
  { ledger: "bitcoin_without_tor", overrideName: "bitcoin_without_tor" },
  { ledger: "bitcoin_cash", overrideName: undefined },
  { ledger: "dogecoin", overrideName: undefined },
  { ledger: "litecoin", overrideName: undefined },
  { ledger: "zcash", overrideName: undefined }
]

export default function NetworkPage() {
  const nodesData = ledgers.flatMap(({ ledger, overrideName }) => {
    const fileName = getNetworkCsvFileName("nodes", ledger)
    const csvPath = `${NETWORK_CSV}${fileName}`
    const { data } = useNetworkCsvLoader(csvPath, "nodes", overrideName)
    return data || []
  })

  const orgData = ledgers.flatMap(({ ledger, overrideName }) => {
    const fileName = getNetworkCsvFileName("organizations", ledger)
    const csvPath = `${NETWORK_CSV}${fileName}`
    const { data } = useNetworkCsvLoader(csvPath, "organizations", overrideName)
    return data || []
  })

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
