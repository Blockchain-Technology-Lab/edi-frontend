import { useEffect, useState } from "react"
import { Card, LineChart } from "@/components"
import { GEOGRAPHY_CSV, DataEntry } from "@/utils"
import {
  getGeographyCsvFileName,
  loadGeographyCsvData
} from "@/utils/geography"

const ledgers = [
  { ledger: "bitcoin_without_tor", overrideName: "bitcoin" },
  { ledger: "bitcoin_cash" },
  { ledger: "dogecoin" },
  { ledger: "litecoin" },
  { ledger: "zcash" }
]

export default function GeographyPage() {
  const [countriesData, setCountriesData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const countries: DataEntry[] = []

        for (const { ledger, overrideName } of ledgers) {
          const countriesFile = getGeographyCsvFileName("countries", ledger)
          const countriesPath = `${GEOGRAPHY_CSV}${countriesFile}`
          const c = await loadGeographyCsvData(
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
  }, [])

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
