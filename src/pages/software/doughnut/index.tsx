import { useEffect, useMemo, useState } from "react"
import {
  generateDoughnutPaths,
  getSoftwareDoughnutCsvFileName,
  prepareFinalDataForCharts,
  SOFTWARE_DOUGHNUT_LEDGER_NAMES
} from "@/utils"
import { useDoughnutCsvLoader } from "@/hooks"
import { Alert, Card, Link, ListBox } from "@/components"
import { DoughnuChart } from "@/components/ui/DoughnutChart"

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

  const [selectedDoughnut] = useState("")
  const doughnutFilenames = useMemo(
    () =>
      getSoftwareDoughnutCsvFileName(
        selectedWeight.value,
        selectedEntity.value
      ),
    [selectedWeight, selectedEntity]
  )

  //const csvDoughnutPath = `/output/software/doughnut/${doughnutFilename}`

  // Generate the paths
  const doughnutPaths = generateDoughnutPaths(doughnutFilenames)

  //const { doughnutData, doughnutLoading, doughnutError } =    useDoughnutCsvLoader(csvDoughnutPath)

  // Map over doughnutPaths and call useDoughnutCsvLoader for each path
  const doughnutResults = doughnutPaths.map((path) =>
    useDoughnutCsvLoader(path)
  )

  // Extract data, loading, and error arrays
  //const doughnutData = doughnutResults.map((result) => result.doughnutData)
  const doughnutLoading = doughnutResults.map(
    (result) => result.doughnutLoading
  )
  const doughnutError = doughnutResults.map((result) => result.doughnutError)

  const finalDataArray = prepareFinalDataForCharts(doughnutResults)

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

      {doughnutError[0] && <Alert message="Error loading data" />}

      {!doughnutError[0] && (
        <>
          {REPO_LIST.map((repoName, index) => (
            <Card key={index} title={repoName} titleAppearance="lg">
              <p>{REPO_LIST[index]}</p>
              <DoughnuChart
                key={index}
                data={finalDataArray[index]}
                isLoadingCsvData={doughnutLoading[index]}
                fileName={repoName}
                watermarkUrl="/images/edi-black-watermark.png"
              ></DoughnuChart>
            </Card>
          ))}
          {/*
          <Card title="Bitcoin" titleAppearance="lg">
            <p>{REPO_LIST[0]}</p>
            <DoughnuChart
              data={finalDataArray[0]}
              isLoadingCsvData={doughnutLoading[0]}
              fileName="bitcoin-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Bitcoin-Cash" titleAppearance="lg">
            <p>{REPO_LIST[1]}</p>
            <DoughnuChart
              data={finalDataArray[1]}
              isLoadingCsvData={doughnutLoading[1]}
              fileName="bitcoin-cash-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Cardano" titleAppearance="lg">
            <p>{REPO_LIST[2]}</p>
            <DoughnuChart
              data={finalDataArray[2]}
              isLoadingCsvData={doughnutLoading[2]}
              fileName="cardano-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Ethereum" titleAppearance="lg">
            <p>{REPO_LIST[3]}</p>
            <DoughnuChart
              data={finalDataArray[3]}
              isLoadingCsvData={doughnutLoading[3]}
              fileName="ethereum-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Litecoin" titleAppearance="lg">
            <p>{REPO_LIST[4]}</p>
            <DoughnuChart
              data={finalDataArray[4]}
              isLoadingCsvData={doughnutLoading[4]}
              fileName="litecoin-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Ethereum (Nethermind)" titleAppearance="lg">
            <p>{REPO_LIST[5]}</p>
            <DoughnuChart
              data={finalDataArray[5]}
              isLoadingCsvData={doughnutLoading[5]}
              fileName="ethereum-nethermind-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Polkadot" titleAppearance="lg">
            <p>{REPO_LIST[6]}</p>
            <DoughnuChart
              data={finalDataArray[6]}
              isLoadingCsvData={doughnutLoading[6]}
              fileName="polkadot-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Solana" titleAppearance="lg">
            <p>{REPO_LIST[7]}</p>
            <DoughnuChart
              data={finalDataArray[7]}
              isLoadingCsvData={doughnutLoading[7]}
              fileName="solana-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="Tezos" titleAppearance="lg">
            <p>{REPO_LIST[8]}</p>
            <DoughnuChart
              data={finalDataArray[8]}
              isLoadingCsvData={doughnutLoading[8]}
              fileName="tezos-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          <Card title="ZCash" titleAppearance="lg">
            <p>{REPO_LIST[9]}</p>
            <DoughnuChart
              data={finalDataArray[9]}
              isLoadingCsvData={doughnutLoading[9]}
              fileName="zcash-doughnut.png"
              watermarkUrl="/images/edi-black-watermark.png"
            ></DoughnuChart>
          </Card>
          */}
        </>
      )}
    </section>
  )
}
