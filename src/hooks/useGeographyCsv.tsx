import { useEffect, useState } from "react";
import {
  getGeographyCsvFileName,
  loadGeographyCsvData,
} from "@/utils/geography";
import { GEOGRAPHY_CSV } from "@/utils";
import type { DataEntry } from "@/utils/types";

const LEDGERS = [
  "bitcoin_without_tor",
  "bitcoin_cash",
  "dogecoin",
  "litecoin",
  "zcash",
  "consensus",
  "execution"
];

export function useGeographyCsv() {
  const [nodesData, setNodesData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const results = await Promise.all(
          LEDGERS.map(async (ledger) => {
            const fileName = getGeographyCsvFileName(ledger);
            const path = `${GEOGRAPHY_CSV}${fileName}`;
            return await loadGeographyCsvData(path, ledger);
          })
        );

        setNodesData(results.flat());
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { nodesData, loading, error };
}
