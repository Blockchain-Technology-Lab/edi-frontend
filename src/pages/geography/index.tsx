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

export default function GeographyPage() {
  const [countriesData, setCountriesData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showWithoutTor, handleToggle } = useWithoutTorToggle()

  useEffect(() => {
    async function loadData() {
      try {
        const countries: DataEntry[] = []

        for (const { ledger, overrideName } of ledgers) {
          if (ledger === "bitcoin" && showWithoutTor) continue
          if (ledger === "bitcoin_without_tor" && !showWithoutTor) continue

          const countriesFile = getNetworkCsvFileName("countries", ledger)
          const countriesPath = `${NETWORK_CSV}${countriesFile}`
          const c = await loadNetworkCsvData(
            countriesPath,
            "countries",
            overrideName
          )
          countries.push(...c)
        }

        setCountriesData(countries)
      } catch (err) {
        console.error(err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [showWithoutTor])

  return (
    <section className="flex flex-col gap-12">
      <Card title="Geography Layer" titleAppearance="xl">
        <p>
          Decentralization metrics based on geographical distribution of nodes.
        </p>
      </Card>

      <Card title="Countries">
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
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={loading}
            timeUnit="day"
          />
        </Card>
        <Card title="Nakamoto Coefficient">
          <LineChart
            metric="nakamoto_coefficient"
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={loading}
            timeUnit="day"
          />
        </Card>
        <Card title="Max Power Ratio">
          <LineChart
            metric="max_power_ratio"
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={loading}
            timeUnit="day"
          />
        </Card>
        <Card title="Entropy">
          <LineChart
            metric="entropy_1"
            type="geography"
            csvData={countriesData}
            isLoadingCsvData={loading}
            timeUnit="day"
          />
        </Card>
      </Card>
    </section>
  )
}
