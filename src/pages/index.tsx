import { Card, LineChart, Link, ListBox, ListBoxMulti } from "@/components"
import { useState } from "react"

const CSV_PATH = "/output/takonomics/output-absolute_1000.csv"

const THRESHOLDING_ITEMS = [
  { label: "100", value: "100" },
  { label: "1000", value: "1000" },
  { label: "50%", value: "50p" },
  { label: "Above $0.01", value: "above" },
  { label: "None", value: "none" }
]

const CLUSTERING_ITEMS = [
  { label: "Explorers", value: "explorers" },
  { label: "Staking Keys", value: "staking" },
  { label: "Multi-input transactions", value: "multi" }
]

export default function HomePage() {
  const [selectedThreshold, setSelectedThreshold] = useState(
    THRESHOLDING_ITEMS[0]
  )
  const [selectedClusters, setSelectedClusters] = useState([
    CLUSTERING_ITEMS[0],
    CLUSTERING_ITEMS[1]
  ])

  return (
    <section className="flex flex-col gap-12">
      <Card title="Takonomics Layer" titleAs="h1" titleAppearance="xl">
        <p>
          These graphs represent the historical decentralisation of token
          ownership for various blockchain systems. Each metric is calculated
          based on the distribution of tokens across the addresses / entities
          that held them in each time period.{" "}
          <Link href="/methodology">Read more...</Link>
        </p>
      </Card>
      <Card title="Options">
        <div className="space-y-3">
          <ListBox
            label="Thresholding"
            items={THRESHOLDING_ITEMS}
            selectedItem={selectedThreshold}
            onChange={setSelectedThreshold}
          />
          <ListBoxMulti
            label="Clustering"
            items={CLUSTERING_ITEMS}
            selectedItems={selectedClusters}
            onChange={setSelectedClusters}
          />
        </div>
      </Card>
      <Card title="Nakamoto coefficient" titleAppearance="lg">
        <p>
          The Nakamoto coefficient represents the minimum number of entities
          that collectively control more than 50% of the resources (in this
          case, the majority of circulating tokens at a given point in time).
        </p>
        <LineChart metric="tau=0.5" csvPath={CSV_PATH} />
      </Card>
      <Card title="Gini coefficient" titleAppearance="lg">
        <p>
          The Gini coefficient represents the degree of inequality in a
          distribution. Values close to 0 indicate equality (all entities in the
          system control the same amount of assets) and values close to 1
          indicate inequality (one entity holds most or all tokens).
        </p>
        <LineChart metric="gini" csvPath={CSV_PATH} />
      </Card>
      <Card title="Shannon Entropy" titleAppearance="lg">
        <p>
          Shannon entropy (also known as information entropy) represents the
          expected amount of information in a distribution . Typically, a higher
          value of entropy indicates higher decentralization (lower
          predictability).
        </p>
        <LineChart metric="shannon_entropy" csvPath={CSV_PATH} />
      </Card>
      <Card title="HHI" titleAppearance="lg">
        <p>
          The Herfindahl-Hirschman Index (HHI) is a measure of market
          concentration. It is defined as the sum of the squares of the market
          shares (as whole numbers, e.g. 40 for 40%) of the entities in the
          system. Values close to 0 indicate low concentration (many entities
          hold a similar number of tokens) and values close to 10,000 indicate
          high concentration (one entity controls most or all tokens).
        </p>
        <LineChart metric="hhi" csvPath={CSV_PATH} />
      </Card>
      <Card title="Theil index" titleAppearance="lg">
        <p>
          The Theil index captures the lack of diversity, or the redundancy, in
          a population. In practice, it is calculated as the maximum possible
          entropy minus the observed entropy. Values close to 0 indicate
          equality and values towards infinity indicate inequality.
        </p>
        <LineChart metric="theil" csvPath={CSV_PATH} />
      </Card>
      <Card title="Max power ratio" titleAppearance="lg">
        <p>
          The max power ratio represents the share of tokens that are owned by
          the most “powerful” entity, i.e. the wealthiest entity.
        </p>
        <LineChart metric="mpr" csvPath={CSV_PATH} />
      </Card>
      <Card title="τ-decentralization index" titleAppearance="lg">
        <p>
          The τ-decentralization index is a generalization of the Nakamoto
          coefficient. It is defined as the minimum number of entities that
          collectively control more than a fraction τ of the total resources (in
          this case more than 66% of the total tokens in circulation).
        </p>
        <LineChart metric="tau=0.66" csvPath={CSV_PATH} />
      </Card>
    </section>
  )
}
