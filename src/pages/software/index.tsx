import { useMemo, useState } from "react"
import {
  generateDoughnutPaths,
  getSoftwareCsvFileName,
  getSoftwareDoughnutCsvFileName,
  SOFTWARE_CSV,
  SOFTWARE_DOUGHNUT_LEDGER_NAMES
} from "@/utils"
import { useCsvLoader } from "@/hooks"
import {
  Alert,
  Card,
  ListBox,
  LineChart,
  Link,
  DoughnutChartRenderer
} from "@/components"

const WEIGHT_ITEMS = [
  { label: "Number of commits", value: "commits" },
  { label: "Number of lines changed", value: "lines" },
  { label: "Number of merge commits", value: "merge" }
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

const DOUGHNUT_WEIGHT_ITEMS = [
  { label: "Number of commits", value: "commits" },
  { label: "Number of lines changed", value: "lines" }
]

const DOUGHNUT_ENTITY_ITEMS = [
  { label: "Author", value: "author" },
  { label: "Committer", value: "committer" }
]

const REPO_LIST = SOFTWARE_DOUGHNUT_LEDGER_NAMES

export default function SoftwarePage() {
  const [selectedCommits, setSelectedCommits] = useState(COMMITS_ITEMS[2])

  const [selectedEntity, setSelectedEntity] = useState(ENTITY_ITEMS[1])

  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_ITEMS[1])

  const [selectedDoughnutEntity, setSelectedDoughnutEntity] = useState(
    DOUGHNUT_ENTITY_ITEMS[1]
  )

  const [selectedDoughnutWeight, setSelectedDoughnutWeight] = useState(
    DOUGHNUT_WEIGHT_ITEMS[0]
  )

  const filename = useMemo(
    () =>
      getSoftwareCsvFileName(
        selectedWeight.value,
        selectedEntity.value,
        selectedCommits.value
      ),
    [selectedWeight, selectedEntity, selectedCommits]
  )

  const doughnutFilenames = useMemo(
    () =>
      getSoftwareDoughnutCsvFileName(
        selectedDoughnutWeight.value,
        selectedDoughnutEntity.value
      ),
    [selectedDoughnutWeight, selectedDoughnutEntity]
  )

  const doughnutPaths = generateDoughnutPaths(doughnutFilenames)

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
          These graphs represent the historical decentralisation of software
          development for various blockchain implementations. Each metric value
          is calculated based on the distribution of some contribution type
          (e.g. number of commits or lines changed) across contributors over a
          sample of commits.{" "}
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
            label="Contributor Type"
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
            <p>
              The total entities metric captures the number of contributors that
              made at least one contribution in some sample window.
            </p>
            <LineChart
              metric="total_entities"
              type="software"
              csvData={data}
              isLoadingCsvData={loading}
            />
          </Card>
        </>
      )}

      {/* New Contributor Distribution Section */}
      <div id="doughnut">
        <section className="flex flex-col gap-12">
          <Card
            title="Contributor Distribution"
            titleAs="h1"
            titleAppearance="xl"
          >
            <p>
              These graphs represent the all-time distribution of contributors
              for various blockchain implementations.{" "}
              <Link href="/software/methodology">Read more...</Link>
            </p>
          </Card>

          <Card title="Options" titleAs="h2">
            <div className="grid laptop:grid-cols-2 gap-3">
              <ListBox
                label="Contribution Type"
                items={DOUGHNUT_WEIGHT_ITEMS}
                selectedItem={selectedDoughnutWeight}
                onChange={setSelectedDoughnutWeight}
              />
              <ListBox
                label="Entity"
                items={DOUGHNUT_ENTITY_ITEMS}
                selectedItem={selectedDoughnutEntity}
                onChange={setSelectedDoughnutEntity}
              />
            </div>
          </Card>

          {REPO_LIST.map((repoItem, index) => (
            <Card key={index} title={repoItem.name} titleAppearance="lg">
              <p>
                Repository:{" "}
                <a
                  href={repoItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repoItem.repo}
                </a>
              </p>
              <DoughnutChartRenderer
                key={index}
                path={doughnutPaths[index]}
                repoName={repoItem.repo}
              />
            </Card>
          ))}
        </section>
      </div>
    </section>
  )
}
