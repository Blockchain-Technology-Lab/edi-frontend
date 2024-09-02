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
  const [selectedEntity, setSelectedEntity] = useState(ENTITY_ITEMS[1])
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
            label="Weight"
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

      {REPO_LIST.map((repoName, index) => (
        <Card key={index} title={repoName} titleAppearance="lg">
          <p>{REPO_LIST[index]}</p>
          <DoughnutChartRenderer
            key={index}
            path={doughnutPaths[index]}
            repoName={repoName}
          />
        </Card>
      ))}
    </section>
  )
}
