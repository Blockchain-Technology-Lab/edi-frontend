// pages/consensus/index.tsx
import { useMemo, useState } from "react"
import { getConsensusCsvFileName } from "@/utils"
import { useConsensusCsvAll } from "@/hooks"
import { Alert, Card, LineChart, Link, ListBoxMulti } from "@/components"

const CLUSTERING_ITEMS = [
  { label: "Explorers", value: "explorers" },
  { label: "On-chain metadata", value: "onchain" }
]

const METRICS = [
  {
    metric: "nakamoto_coefficient",
    title: "Nakamoto coefficient",
    decimals: 0,
    description:
      "The Nakamoto coefficient represents the minimum number of entities that collectively control more than 50% of the resources (in this case, the majority of mining / staking power)."
  },
  {
    metric: "gini",
    title: "Gini coefficient",
    decimals: 2,
    description:
      "The Gini coefficient represents the degree of inequality in a distribution. Values close to 0 indicate high equality (in our case, all entities in the system produce the same number of blocks) and values close to 1 indicate high inequality (one entity produces most or all blocks)."
  },
  {
    metric: "entropy=1",
    title: "Shannon entropy",
    decimals: 2,
    description:
      "Shannon entropy (also known as information entropy) represents the expected amount of information in a distribution. Typically, a higher value of entropy indicates higher decentralisation (lower predictability)."
  },
  {
    metric: "hhi",
    title: "HHI",
    decimals: 0,
    description:
      "The Herfindahl-Hirschman Index (HHI) is a measure of market concentration. It is defined as the sum of the squares of the market shares (as whole numbers, e.g. 40 for 40%) of the entities in the system. Values close to 0 indicate low concentration (many entities produce a similar number of blocks) and values close to 10,000 indicate high concentration (one entity produces most or all blocks)."
  },
  {
    metric: "theil_index",
    title: "Theil index",
    decimals: 2,
    description:
      "The Theil index captures the lack of diversity, or the redundancy, in a population. In practice, it is calculated as the maximum possible entropy minus the observed entropy. Values close to 0 indicate equality and values towards infinity indicate inequality."
  },
  {
    metric: "concentration_ratio=1",
    title: "1-concentration ratio",
    decimals: 2,
    description:
      'The 1-concentration ratio represents the share of blocks that are produced by the single most "powerful" entity, i.e. the entity that produces the most blocks.'
  },
  {
    metric: "tau_index=0.66",
    title: "Tau Index",
    decimals: 0,
    description:
      "The τ-decentralisation index represents the minimum number of entities that collectively control more than a fraction τ of the total resources (in this case more than 66% of mining / staking power)."
  }
]

export default function ConsensusPage() {
  const [selectedClusters, setSelectedClusters] = useState(CLUSTERING_ITEMS)

  const fileName = useMemo(() => {
    const clustering = selectedClusters.map((c) => c.value)
    return getConsensusCsvFileName(clustering)
  }, [selectedClusters])

  const { data, loading, error } = useConsensusCsvAll(fileName)

  return (
    <section className="flex flex-col gap-12">
      <Card title="Consensus Layer" titleAs="h1" titleAppearance="xl">
        <p>
          These graphs represent the historical decentralisation of{" "}
          <i>block production</i> for various blockchain systems. Each metric is
          calculated from the distribution of blocks across producing entities.{" "}
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
      {!error &&
        METRICS.map((m) => (
          <Card key={m.metric} title={m.title} titleAppearance="lg">
            <p>{m.description}</p>
            <LineChart
              metric={m.metric}
              type="consensus"
              csvData={data}
              isLoadingCsvData={loading}
              tooltipDecimals={m.decimals}
            />
          </Card>
        ))}
    </section>
  )
}
