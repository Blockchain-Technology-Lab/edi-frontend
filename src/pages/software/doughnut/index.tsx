import { useMemo, useState } from "react"
import { getRandomColor, getSoftwareDoughnutCsvFileName } from "@/utils"
import { useDoughnutCsvLoader } from "@/hooks"
import { Alert, Card, Link } from "@/components"
import { DoughnuChart } from "@/components/ui/DoughnutChart"

export default function SoftwareDoughnutPage() {
  const [selectedDoughnut] = useState("")
  const doughnutFilename = useMemo(
    () => getSoftwareDoughnutCsvFileName(),
    [selectedDoughnut]
  )

  const csvDoughnutPath = `/output/software/doughnut/${doughnutFilename}`

  const { doughnutData, doughnutLoading, doughnutError } =
    useDoughnutCsvLoader(csvDoughnutPath)

  const finalData = {
    labels: doughnutData.map((item) => item.author),
    datasets: [
      {
        data: doughnutData.map((item) => Math.round(item.commits)),
        backgroundColor: getRandomColor, // Ensure default color
        borderColor: getRandomColor, // Ensure default border color
        borderWidth: 1,
        dataVisibility: new Array(doughnutData.length).fill(true) // If you are using this option
      }
    ]
  }

  const options: any = {
    plugins: {
      responsive: true
    }
  }

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
          <Link href="/software/doughnut/methodology">Read more...</Link>
        </p>
      </Card>
      {doughnutError && <Alert message="Error loading data" />}

      {!doughnutError && (
        <>
          <Card title="Doughnut" titleAppearance="lg">
            <p>The Doughnut Chart</p>
            <DoughnuChart
              data={finalData}
              isLoadingCsvData={doughnutLoading}
            ></DoughnuChart>
          </Card>
        </>
      )}
    </section>
  )
}
