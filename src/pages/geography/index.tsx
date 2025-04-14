import { useEffect, useState } from "react"
import { Card, LineChart, DoughnutChartRenderer } from "@/components"
import { GEOGRAPHY_CSV, DataEntry } from "@/utils"
import {
  getGeographyCsvFileName,
  loadGeographyCsvData,
  getGeographyDoughnutCsvFileName
} from "@/utils/geography"

const ledgers = [
  { ledger: "bitcoin_without_tor", overrideName: "bitcoin" },
  { ledger: "bitcoin_cash" },
  { ledger: "dogecoin" },
  { ledger: "litecoin" },
  { ledger: "zcash" }
]

const doughnut_ledgers = [
  "bitcoin",
  "bitcoin_cash",
  "litecoin",
  "dogecoin",
  "zcash"
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
          These graphs represent the geographic decentralisation. Each metric
          value is calculated based on the distribution of nodes across
          countries.
        </p>
      </Card>

      <Card title="HHI">
        <p>
          The Herfindahl-Hirschman Index (HHI) is a measure of market
          concentration. It is defined as the sum of the squares of the market
          shares (as whole numbers, e.g. 40 for 40%) of the entities in the
          system. Values close to 0 indicate low concentration (many countries
          host a similar number of nodes) and values close to 10,000 indicate
          high concentration (one country hosts most or all nodes).
        </p>
        <LineChart
          metric="hhi"
          type="geography"
          csvData={countriesData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>
      <Card title="Nakamoto Coefficient">
        <p>
          The Nakamoto coefficient represents the minimum number of entities
          that collectively host more than 50% of the resources (in this case,
          the majority of nodes).
        </p>
        <LineChart
          metric="nakamoto_coefficient"
          type="geography"
          csvData={countriesData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>
      <Card title="1-concentration ratio">
        <p>
          The 1-concentration ratio represents the share of nodes that are owned
          by the single most “powerful” entity, i.e. the entity that hosts the
          most nodes.
        </p>
        <LineChart
          metric="max_power_ratio"
          type="geography"
          csvData={countriesData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>
      <Card title="Shannon entropy">
        <p>
          Shannon entropy (also known as information entropy) represents the
          expected amount of information in a distribution. Typically, a higher
          value of entropy indicates higher decentralisation (lower
          predictability)
        </p>
        <LineChart
          metric="entropy_1"
          type="geography"
          csvData={countriesData}
          isLoadingCsvData={loading}
          timeUnit="day"
        />
      </Card>

      <Card title="Countries">
        <p>
          These graphs represent the distribution of nodes across countries.
          Regarding the Bitcoin network, more than half of the nodes use Tor,
          and it is impossible to know in which countries they are located. For
          the metrics shown below, it was therefore decided to distribute these
          nodes proportionally among the different countries.
        </p>
        {doughnut_ledgers.map((ledger) => (
          <Card key={ledger} title={ledger} titleAppearance="lg">
            <DoughnutChartRenderer
              path={`${GEOGRAPHY_CSV}${getGeographyDoughnutCsvFileName(ledger)}`}
              fileName={ledger}
            />
          </Card>
        ))}
      </Card>
    </section>
  )
}
