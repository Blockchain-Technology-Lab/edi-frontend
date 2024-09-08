import { useMemo, useState } from "react"
import { getSoftwareCsvFileName, SOFTWARE_CSV } from "@/utils"
import { useCsvLoader } from "@/hooks"
import { Alert, Card, ListBox, LineChart, Link } from "@/components"

const WEIGHT_ITEMS = [
  { label: "Number of commits", value: "commits" },
  { label: "Number of lines changed", value: "lines" }
]

const ENTITY_ITEMS = [
  { label: "Author", value: "author" },
  { label: "Committer", value: "committer" }
]

const COMMITS_ITEMS = [
  { label: "100", value: "100" },
  { label: "250", value: "250" },
  { label: "500", value: "500" },
  { label: "1000", value: "1000" }
]

export default function SoftwarePage() {
  const [selectedCommits, setSelectedCommits] = useState(COMMITS_ITEMS[2])

  const [selectedEntity, setSelectedEntity] = useState(ENTITY_ITEMS[1])

  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_ITEMS[1])

  const filename = useMemo(
    () =>
      getSoftwareCsvFileName(
        selectedWeight.value,
        selectedEntity.value,
        selectedCommits.value
      ),
    [selectedWeight, selectedEntity, selectedCommits]
  )
  /*
   * The dashboard is currently hosted at https://groups.inf.ed.ac.uk/blockchainlab/edi-dashboard/
   * whereas the URL http://blockchainlab.inf.ed.ac.uk/edi-dashboard/ is also pointed at the groups' directory;
   * therefore, we may need to have two different builds based upon the basePath;
   * const csvPath = `/blockchainlab/edi-dashboard/output/consensus/${filename}`
   * OR
   * const csvPath = `/edi-dashboard/output/consensus/${filename}`
   */
  //const csvPath = `/output/software/line/${filename}`

  const csvPath = `${SOFTWARE_CSV + filename}`
  const { data, loading, error } = useCsvLoader(csvPath, "software")

  return (
    <section className="flex flex-col gap-12">
      <Card title="Software Layer" titleAs="h1" titleAppearance="xl">
        <p>
          These graphs represent the historical decentralisation of{" "}
          <i>block production</i> for various blockchain systems. Each metric is
          calculated based on the distribution of blocks across the entities
          that produced them in each time period.{" "}
          <Link href="/software/methodology">Read more...</Link>
        </p>
      </Card>
      <Card title="Options" titleAs="h2">
        <div className="grid laptop:grid-cols-2 gap-3">
          <ListBox
            label="Contribution Type"
            items={WEIGHT_ITEMS}
            selectedItem={selectedWeight}
            onChange={setSelectedWeight}
          />
          <ListBox
            label="Entity"
            items={ENTITY_ITEMS}
            selectedItem={selectedEntity}
            onChange={setSelectedEntity}
          />
          <ListBox
            label="Sample Window"
            items={COMMITS_ITEMS}
            selectedItem={selectedCommits}
            onChange={setSelectedCommits}
          />
        </div>
      </Card>
      {error && <Alert message="Error loading data" />}
      {!error && (
        <>
          <Card title="Shannon Entropy" titleAppearance="lg">
            <p>
              Shannon entropy (also known as information entropy) represents the
              expected amount of information in a distribution. Typically, a
              higher value of entropy indicates higher decentralization (lower
              predictability).
            </p>
            <LineChart
              metric="entropy"
              type="software"
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
              type="software"
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
              type="software"
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
              type="software"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
          <Card title="Total Entities" titleAppearance="lg">
            <p>The total_entities</p>
            <LineChart
              metric="total_entities"
              type="software"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
        </>
      )}
    </section>
  )
}
