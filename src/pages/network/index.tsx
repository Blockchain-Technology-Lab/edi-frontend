import {
  DistributionCard,
  DoughnutTopCard,
  LayerTopCard,
  MetricsCard,
  MetricsTopCard,
  DoughnutCard,
  BarChart,
} from "@/components";
import { useEffect, useRef } from "react";

import { useLocation, useNavigate } from "@tanstack/react-router";
import { networkContributorRoute } from "@/router";
import { useNetworkCsv } from "@/hooks";
import {
  getNetworkDoughnutCsvFileName,
  NETWORK_DOUGHNUT_LEDGERS,
  NETWORK_METRICS,
} from "@/utils/network";
import { DOUGHNUT_CARD, NETWORK_CARD, ORG_DISTRIBUTOR } from "@/utils";
import { networkMethodologyTo } from "@/routes/routePaths";

export function Network() {
  const contributorRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === "/network/contributor" &&
      contributorRef.current
    ) {
      contributorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  const handleContributorScrollClick = () => {
    if (location.pathname === networkContributorRoute.to) {
      contributorRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate({ to: networkContributorRoute.to });
    }
  };

  const { nodesData, orgData, loading, error } = useNetworkCsv();

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4 items-stretch">
          {/* 3/4th - LayerTopCard */}
          <div className="col-span-3">
            <LayerTopCard
              title="Network Layer"
              description={
                <>
                  These graphs represent the network decentralisation. The
                  results are based only on data we have collected and do not
                  include extensive historical data.
                </>
              }
              imageSrc={NETWORK_CARD}
              methodologyPath={networkMethodologyTo}
              githubUrl="https://github.com/Blockchain-Technology-Lab/network-decentralization"
            />
          </div>

          {/* 1/4th - Doughnut Link Card */}
          <DistributionCard
            title="Organisation Distribution"
            imageSrc={DOUGHNUT_CARD}
            onClick={handleContributorScrollClick}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  ">
          <BarChart
            title="Full Nodes by Ledger"
            data={nodesData}
            loading={loading}
            description="The following graph represents the number of nodes participating in the network."
          />
          {error && <div className="text-error mt-2">{error.message}</div>}
        </div>
        <MetricsTopCard
          title={"Organisations metrics"}
          description={
            "The following graphs represent different metrics concerning the distribution of nodes across organisations. Regarding the Bitcoin network, more than half of the nodes use Tor, and it is impossible to know which organisations own them. For the metrics shown below, it was therefore decided to distribute these nodes proportionally among the different organisations."
          }
          imageSrc={ORG_DISTRIBUTOR}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {!error &&
            NETWORK_METRICS.map((m) => (
              <MetricsCard
                key={m.metric}
                metric={m}
                data={orgData}
                loading={loading}
                type="network"
              />
            ))}
        </div>

        <div ref={contributorRef}>
          <DoughnutTopCard
            title={"Organisation Distribution"}
            description={
              "These charts represent the distribution of nodes across organisations, based on the latest snapshot for each system. An organisation here corresponds to the entity that is responsible for the network of the node's IP address."
            }
            imageSrc={DOUGHNUT_CARD}
            methodologyPath={networkMethodologyTo}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {NETWORK_DOUGHNUT_LEDGERS.map((ledger, index) => (
            <DoughnutCard
              key={index}
              repoItem={{
                name: ledger.name,
                url: `https://github.com/Blockchain-Technology-Lab/network-decentralization`,
                repo: ledger.chain,
              }}
              path={`${getNetworkDoughnutCsvFileName(ledger.chain)}`}
              fileName={ledger.chain}
            />
          ))}
        </div>
      </div>
    </>
  );
}
