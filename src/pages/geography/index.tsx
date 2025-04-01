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

export default function GeographyPage() {
  const countriesData = ledgers.flatMap(({ ledger, overrideName }) => {
    const fileName = getNetworkCsvFileName("countries", ledger)
    const csvPath = `${NETWORK_CSV}${fileName}`
    const { data } = useNetworkCsvLoader(csvPath, "countries", overrideName)
    return data || []
  })

  return (
    <section className="flex flex-col gap-12">
      <Card title="Geography Layer" titleAppearance="xl">
        <p>
          Decentralization metrics based on geographical distribution of nodes.
        </p>
      </Card>

      <Card title="Countries">
        <Card title="HHI">
          <LineChart
            metric="hhi"
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={false}
            timeUnit="day"
          />
        </Card>
        <Card title="Nakamoto Coefficient">
          <LineChart
            metric="nakamoto_coefficient"
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={false}
            timeUnit="day"
          />
        </Card>
        <Card title="Max Power Ratio">
          <LineChart
            metric="max_power_ratio"
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={false}
            timeUnit="day"
          />
        </Card>
        <Card title="Entropy">
          <LineChart
            metric="entropy_1"
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={false}
            timeUnit="day"
          />
        </Card>
      </Card>
    </section>
  )
}
