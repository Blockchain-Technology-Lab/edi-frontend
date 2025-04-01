import { Card, LineChart } from "@/components"
import { useNetworkCsvLoader } from "@/hooks"
import { getNetworkCsvFileName, NETWORK_CSV } from "@/utils"

const ledgers = ["bitcoin", "bitcoin_cash", "dogecoin", "litecoin", "zcash"]

export default function NetworkPage() {
  // === Load Nodes CSVs ===
  const nodesData = ledgers.flatMap((ledger) => {
    const fileName = getNetworkCsvFileName("nodes", ledger)
    const csvPath = `${NETWORK_CSV}${fileName}`
    const { data } = useNetworkCsvLoader(csvPath, "nodes")
    return data || []
  })

  const isLoadingNodes = nodesData.some((entry) => !entry)

  // === Load Countries CSVs ===
  const countriesData = ledgers.flatMap((ledger) => {
    const fileName = getNetworkCsvFileName("countries", ledger)
    const csvPath = `${NETWORK_CSV}${fileName}`
    const { data } = useNetworkCsvLoader(csvPath, "countries")
    return data || []
  })

  const isLoadingCountries = countriesData.some((entry) => !entry)

  // === Load Organizations CSVs ===
  const orgData = ledgers.flatMap((ledger) => {
    const fileName = getNetworkCsvFileName("organizations", ledger)
    const csvPath = `${NETWORK_CSV}${fileName}`
    const { data } = useNetworkCsvLoader(csvPath, "organizations")
    return data || []
  })

  const isLoadingOrg = orgData.some((entry) => !entry)

  return (
    <section className="flex flex-col gap-12">
      <Card title="Network Layer" titleAppearance="xl">
        <p>
          This dashboard visualizes decentralization metrics at the Network
          Layer.
        </p>
      </Card>

      {/* ================= Nodes Section =================== */}
      <section className="flex flex-col gap-12">
        <Card title="Number of Nodes" titleAppearance="lg">
          <p>
            This metric shows the total number of nodes observed in the network
            over time.
          </p>
          <LineChart
            metric="number_nodes"
            type="network"
            csvData={nodesData.flat()}
            isLoadingCsvData={isLoadingNodes}
            timeUnit="day"
          />
        </Card>
      </section>

      {/* ================= Countries Section =================== */}
      <section className="flex flex-col gap-12">
        <Card title="Network by Countries" titleAppearance="lg">
          <p>Metrics based on geographical distribution of network nodes.</p>

          <Card title="Herfindahl-Hirschman Index (HHI)" titleAppearance="lg">
            <p>
              HHI reflects the distribution of nodes across countries. A lower
              HHI indicates better decentralization.
            </p>
            <LineChart
              metric="hhi"
              type="network"
              csvData={countriesData.flat()}
              isLoadingCsvData={isLoadingCountries}
              timeUnit="day"
            />
          </Card>
          <Card title="Nakamoto Coefficient" titleAppearance="lg">
            <p>
              Minimum number of countries that would need to collude to control
              the network.
            </p>
            <LineChart
              metric="nakamoto_coefficient"
              type="network"
              csvData={countriesData.flat()}
              isLoadingCsvData={isLoadingCountries}
              timeUnit="day"
            />
          </Card>
          <Card title="Max Power Ratio" titleAppearance="lg">
            <p>Maximum share of nodes located in a single country.</p>
            <LineChart
              metric="max_power_ratio"
              type="network"
              csvData={countriesData.flat()}
              isLoadingCsvData={isLoadingCountries}
              timeUnit="day"
            />
          </Card>
          <Card title="Entropy" titleAppearance="lg">
            <p>Diversity of node distribution across countries.</p>
            <LineChart
              metric="entropy_1"
              type="network"
              csvData={countriesData.flat()}
              isLoadingCsvData={isLoadingCountries}
              timeUnit="day"
            />
          </Card>
        </Card>
      </section>

      {/* ================= Organizations Section =================== */}
      <section className="flex flex-col gap-12">
        <Card title="Network by Organizations" titleAppearance="lg">
          <p>
            Metrics based on distribution of nodes across different
            organizations.
          </p>

          <Card title="Herfindahl-Hirschman Index (HHI)" titleAppearance="lg">
            <p>HHI reflects the concentration of nodes across organizations.</p>
            <LineChart
              metric="hhi"
              type="network"
              csvData={orgData.flat()}
              isLoadingCsvData={isLoadingOrg}
              timeUnit="day"
            />
          </Card>
          <Card title="Nakamoto Coefficient" titleAppearance="lg">
            <p>
              Minimum number of organizations required to control the network.
            </p>
            <LineChart
              metric="nakamoto_coefficient"
              type="network"
              csvData={orgData.flat()}
              isLoadingCsvData={isLoadingOrg}
              timeUnit="day"
            />
          </Card>
          <Card title="Max Power Ratio" titleAppearance="lg">
            <p>Share of nodes controlled by the single largest organization.</p>
            <LineChart
              metric="max_power_ratio"
              type="network"
              csvData={orgData.flat()}
              isLoadingCsvData={isLoadingOrg}
              timeUnit="day"
            />
          </Card>
        </Card>
      </section>
    </section>
  )
}
