import { useMemo, useState } from "react"
import { getConsensusCsvFileName } from "@/utils"
import { useCsvLoader } from "@/hooks"
import { Alert, Card, LineChart, Link, ListBoxMulti } from "@/components"

const CLUSTERING_ITEMS = [
  { label: "Explorers", value: "explorers" },
  { label: "On-chain metadata", value: "onchain" }
]

export default function ConsensusPage() {
  const [selectedClusters, setSelectedClusters] = useState(CLUSTERING_ITEMS)

  const filename = useMemo(
    () =>
      getConsensusCsvFileName(selectedClusters.map((cluster) => cluster.value)),
    [selectedClusters]
  )
  const csvPath = `/output/consensus/${filename}`
  const { data, loading, error } = useCsvLoader(csvPath, "consensus")

  return (
    <section className="flex flex-col gap-12">
      <Card title="Consensus Layer" titleAs="h1" titleAppearance="xl">
        <p>
          These graphs represent the historical decentralisation of{" "}
          <i>block production</i> for various blockchain systems. Each metric is
          calculated based on the distribution of blocks across the entities
          that produced them in each time period.{" "}
          <Link href="/consensus/methodology">Read more...</Link>
        </p>
      </Card>
      <Card title="Options" titleAs="h2">
        <ListBoxMulti
          label="Clustering"
          items={CLUSTERING_ITEMS}
          selectedItems={selectedClusters}
          onChange={setSelectedClusters}
        />
      </Card>
      {error && <Alert message="Error loading data" />}
      {!error && (
        <>
          <Card title="Nakamoto coefficient" titleAppearance="lg">
            <p>
              The Nakamoto coefficient represents the minimum number of entities
              that collectively control more than 50% of the resources (in this
              case, the majority of mining / staking power).
            </p>
            <LineChart
              metric="nakamoto_coefficient"
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
          <Card title="Gini coefficient" titleAppearance="lg">
            <p>
              The Gini coefficient represents the degree of inequality in a
              distribution. Values close to 0 indicate high equality (in our
              case, all entities in the system produce the same number of
              blocks) and values close to 1 indicate high inequality (one entity
              produces most or all blocks).
            </p>
            <LineChart
              metric="gini"
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
          <Card title="Shannon Entropy" titleAppearance="lg">
            <p>
              Shannon entropy (also known as information entropy) represents the
              expected amount of information in a distribution. Typically, a
              higher value of entropy indicates higher decentralization (lower
              predictability).
            </p>
            <LineChart
              metric="entropy"
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
          <Card title="HHI" titleAppearance="lg">
            <p>
              The Herfindahl-Hirschman Index (HHI) is a measure of market
              concentration. It is defined as the sum of the squares of the
              market shares (as whole numbers, e.g. 40 for 40%) of the entities
              in the system. Values close to 0 indicate low concentration (many
              entities produce a similar number of blocks) and values close to
              10,000 indicate high concentration (one entity produces most or
              all blocks).
            </p>
            <LineChart
              metric="hhi"
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
          <Card title="Theil index" titleAppearance="lg">
            <p>
              The Theil index captures the lack of diversity, or the redundancy,
              in a population. In practice, it is calculated as the maximum
              possible entropy minus the observed entropy. Values close to 0
              indicate equality and values towards infinity indicate inequality.
            </p>
            <LineChart
              metric="theil_index"
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
          <Card title="Max power ratio" titleAppearance="lg">
            <p>
              The max power ratio represents the share of blocks that are
              produced by the most “powerful” entity, i.e. the entity that
              produces the most blocks.
            </p>
            <LineChart
              metric="max_power_ratio"
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
          <Card title="Tau Index" titleAppearance="lg">
            <p>
              The τ-decentralization index represents the minimum number of
              entities that collectively control more than a fraction τ of the
              total resources (in this case more than 66% of mining / staking
              power).
            </p>
            <LineChart
              metric="tau_index"
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
        </>
      )}
    </section>
  )
}
