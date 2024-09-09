import { useMemo, useState } from "react"
import {
  generateDoughnutPaths,
  getSoftwareDoughnutCsvFileName,
  SOFTWARE_DOUGHNUT_LEDGER_NAMES
} from "@/utils"
import { Card, DoughnutChartRenderer, Link, ListBox } from "@/components"

const WEIGHT_ITEMS = [
  { label: "Number of commits", value: "commits" },
  { label: "Number of lines changed", value: "lines" }
]

const ENTITY_ITEMS = [
  { label: "Author", value: "author" },
  { label: "Committer", value: "committer" }
]
/*
const REPO_LIST = [
  "bitcoin",
  "bitcoin-cash-node",
  "cardano-node",
  "go-ethereum",
  "litecoin",
  "nethermind",
  "polkadot-sdk",
  "solana",
  "tezos",
  "zcash"
]
*/
const REPO_LIST = SOFTWARE_DOUGHNUT_LEDGER_NAMES

export default function SoftwareDoughnutPage() {
  const [selectedEntity, setSelectedEntity] = useState(ENTITY_ITEMS[0])
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_ITEMS[1])

  const doughnutFilenames = useMemo(
    () =>
      getSoftwareDoughnutCsvFileName(
        selectedWeight.value,
        selectedEntity.value
      ),
    [selectedWeight, selectedEntity]
  )

  const doughnutPaths = generateDoughnutPaths(doughnutFilenames)

  return (
    <section className="flex flex-col gap-12">
      <Card
        title="Software Layer (Doughnut) "
        titleAs="h1"
        titleAppearance="xl"
      >
        <p>
        These graphs represent the all-time distribution of contributors for various blockchain implementations.{" "}
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
        </div>
      </Card>

      {REPO_LIST.map((repoItem, index) => (
        <Card key={index} title={repoItem.name} titleAppearance="lg">
          <p>
            Repository:{" "}
            <a href={repoItem.url} target="_blank" rel="noopener noreferrer">
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
  )
}
