import { LayerTopCard, MetricsCard, MetricsTopCard } from "@/components";
import { useGovernanceCsv } from "@/hooks/useGovernanceCsv";
import { governanceMethodologyTo } from "@/routes/routePaths";
import { BIP_NETWORK_CARD, GOVERNANCE_CARD, ORG_DISTRIBUTOR } from "@/utils";


export function Governance() {
    const { giniData, loading, error } = useGovernanceCsv();

    if (error) {
        return <div className="text-error p-4">Failed to load governance data: {error.message}</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                <LayerTopCard
                    title="Governance Layer"
                    description={<>We plan to publish this layer soon.</>}
                    imageSrc={GOVERNANCE_CARD}
                    methodologyPath={governanceMethodologyTo}
                    githubUrl="https://github.com/Blockchain-Technology-Lab/governance-decentralization"
                />

                <MetricsTopCard
                    title={"BIP Network"}
                    description={
                        <>This network visualization represents user interactions within Bitcoin Improvement Proposal (BIP) discussions on the forum. Each node represents a forum user who has published BIP-related posts, with node size proportional to the user's degree centrality, indicating the number of interactions (comments) they have received or made. Edges represent direct interactions between users through comments on BIP-related discussions. The top 3 most active users by degree are sipredrica (1,180), achow101 (862), and theymos (518). Remarkably, the top 10 users account for 25% of all comments in the BIP discussion network, where a small core of highly engaged participants drives most of the discussion activity. This reflects the concentrated nature of engagement in Bitcoin off-chain governance discussions.</>
                    }
                    imageSrc={BIP_NETWORK_CARD}
                    layout="split-50-50"
                    imagePosition="left"
                />


                <MetricsTopCard
                    title={"BIP Metrics"}
                    description={
                        <>The following graphs represent different metrics concerning the distribution of BIP comments and governance participation over time.</>
                    }
                    layout="default"
                    imageSrc={ORG_DISTRIBUTOR}

                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    <MetricsCard
                        metric={{
                            metric: "gini_coefficient",
                            title: "Gini Coefficient Activeness",
                            description:
                                "Measures inequality in authorship concentration among top 10 contributors.",
                            decimals: 2,
                        }}
                        data={giniData}
                        loading={loading}
                        type="governance"
                        timeUnit="year"
                    />


                </div>
            </div >
        </>
    )
}