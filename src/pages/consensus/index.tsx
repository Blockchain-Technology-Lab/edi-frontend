import { useMemo, useState } from "react";
import { LayerTopCard, ListBoxMulti, MetricsCard } from "@/components";
import {
  getConsensusCsvFileName,
  CONSENSUS_METRICS,
  CONSENSUS_CARD,
  CONSENSUS_OPTIONS,
} from "@/utils";
import { useConsensusCsvAll } from "@/hooks";
import { consensusMethodologyTo } from "@/routes/routePaths";

export function Consensus() {
  const CLUSTERING_ITEMS = [
    { label: "Explorers", value: "explorers" },
    { label: "On-chain metadata", value: "onchain" },
  ];

  const [selectedClusters, setSelectedClusters] =
    useState<typeof CLUSTERING_ITEMS>(CLUSTERING_ITEMS);

  const fileName = useMemo(() => {
    const clustering = selectedClusters.map((c) => c.value);
    return getConsensusCsvFileName(clustering);
  }, [selectedClusters]);

  const { data, loading, error } = useConsensusCsvAll(fileName);

  return (
    <>
      <div className="flex flex-col gap-6">
        <LayerTopCard
          title="Consensus Layer"
          description={
            <>
              These graphs represent the historical decentralisation of{" "}
              <span className="italic">block production</span> for various
              blockchain systems. Each metric is calculated from the
              distribution of blocks across producing entities.
            </>
          }
          imageSrc={CONSENSUS_CARD}
          methodologyPath={consensusMethodologyTo}
          githubUrl="https://github.com/Blockchain-Technology-Lab/consensus-decentralization"
        />

        <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
          <div className="card-body pl-8">
            <h2 className="card-title text-xl">Clustering Options</h2>
            <p>
              "<span className="font-bold text-accent">Explorers</span>" denote
              attribution and deanonymisation data aggregated from various
              sources.{" "}
            </p>
            <p>
              "<span className="font-bold text-accent">On-chain metadata</span>"
              includes self-declared identifiers, such as names and websites,
              published by consensus participants.{" "}
            </p>
            <ListBoxMulti
              label=""
              items={CLUSTERING_ITEMS}
              selectedItems={selectedClusters}
              onChange={setSelectedClusters}
            />
          </div>
          <figure className="w-full h-24 sm:h-48 md:h-60 overflow-hidden max-h-60 opacity-50 mt-2">
            <img src={CONSENSUS_OPTIONS} alt="Clustering Options" />
          </figure>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          {!error &&
            CONSENSUS_METRICS.map((m) => (
              <MetricsCard
                key={m.metric}
                metric={m}
                data={data}
                loading={loading}
                type="consensus"
              />
            ))}
        </div>
      </div>
    </>
  );
}
