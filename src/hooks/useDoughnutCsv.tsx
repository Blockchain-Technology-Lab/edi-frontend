import type { DoughnutDataEntry } from "@/utils/types"
import { loadDoughnutCsvData } from "@/utils"
import { useCallback, useEffect, useState } from "react"

export function useDoughnutCsvLoader(csvPath: string) {
    const [doughnutData, setDoughnutData] = useState<DoughnutDataEntry[]>([])
    const [doughnutLoading, setDoughnutLoading] = useState<boolean>(true)
    const [doughnutError, setDoughnutError] = useState<Error | null>(null)

    const load = useCallback(async () => {
        setDoughnutLoading(true)
        setDoughnutError(null)
        try {
            const csvDoughnutData = await loadDoughnutCsvData(csvPath)

            const topDoughnutData = getTopNAuthorsWithOthers(csvDoughnutData, 20)

            setDoughnutData(topDoughnutData)
        } catch (error) {
            setDoughnutError(
                error instanceof Error ? error : new Error("Unknown error occurred")
            )
        } finally {
            setDoughnutLoading(false)
        }
    }, [csvPath])

    useEffect(() => {
        load()
    }, [load])
    return { doughnutData, doughnutLoading, doughnutError }
}

function getTopNAuthorsWithOthers(
    data: DoughnutDataEntry[],
    topN: number
): DoughnutDataEntry[] {
    // Sort data by commits in descending order
    const sortedData = data.sort((a, b) => b.commits - a.commits)

    // Get top N entries
    const topNData = sortedData.slice(0, topN)

    // Calculate the total commits of remaining authors
    const remainingData = sortedData.slice(topN)
    const totalRemainingCommits = remainingData.reduce(
        (sum, entry) => sum + entry.commits,
        0
    )

    // Create "Others" entry if there are remaining authors
    const othersEntry =
        totalRemainingCommits > 0
            ? { author: "Others", commits: totalRemainingCommits }
            : null

    // Combine top N data with "Others" entry
    return othersEntry ? [...topNData, othersEntry] : topNData
}
