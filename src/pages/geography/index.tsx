import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import {
  Card,
  LineChart,
  DoughnutChartRenderer,
  Link,
  useScroll
} from "@/components"
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
  { chain: "bitcoin", name: "Bitcoin" },
  { chain: "bitcoin_cash", name: "Bitcoin Cash" },
  { chain: "dogecoin", name: "Dogecoin" },
  { chain: "litecoin", name: "Litecoin" },
  { chain: "zcash", name: "ZCash" }
]

export default function GeographyPage() {
  const { asPath } = useRouter()
  const { registerRef, scrollToSection } = useScroll()

  const topRef = useRef<HTMLDivElement>(null)
  const doughnutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && asPath.includes("#")) {
      const [, hash] = asPath.split("#")
      setTimeout(() => scrollToSection(hash), 100)
    } else {
      // fallback when no hash: scroll to top explicitly
      setTimeout(() => scrollToSection("top"), 100)
    }
    registerRef("top", topRef)
    registerRef("doughnut", doughnutRef)
  }, [asPath, registerRef, scrollToSection])

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
    <section ref={topRef} id="top" className="flex flex-col gap-12">
      <Card title="Geography Layer" titleAppearance="xl">
        <p>
          These graphs represent the geographic decentralisation. The results
          are based only on data we have collected and do not include any
          historical data.{" "}
          <Link href="/geography/methodology">Read more...</Link>
        </p>
      </Card>
      <Card title="Countries metrics">
        <p>
          The following graphs represent different metrics concerning the
          distribution of nodes across countries. Regarding the Bitcoin network,
          more than half of the nodes use Tor (see countries distribution
          (clickable link)), and it is impossible to know in which countries
          they are located. For the metrics shown below, it was therefore
          decided to distribute these nodes proportionally among the different
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
          by the single most &quot;powerful&quot; entity, i.e. the entity that
          hosts the most nodes.
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
      <div ref={doughnutRef} id="doughnut">
        <div className="mb-4">
          <Card title="Countries Distribution">
            <p>
              The following pie charts represent the distribution of nodes
              across countries.
            </p>
          </Card>
        </div>

        {doughnut_ledgers.map((ledger, index) => (
          <Card key={index} title={ledger.name} titleAppearance="lg">
            <DoughnutChartRenderer
              path={`${GEOGRAPHY_CSV}${getGeographyDoughnutCsvFileName(ledger.chain)}`}
              fileName={ledger.chain}
            />
          </Card>
        ))}
      </div>
    </section>
  )
}
