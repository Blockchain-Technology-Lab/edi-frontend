import { CONSENSUS_METHOD_CARD } from "@/utils";

export function TokenomicsMethodology() {
    return (
        <div className="space-y-16 font-roboto">
            {/* Header Image Card with Title */}

            <div className="card w-full bg-base-200 shadow-md overflow-hidden h-48">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center text-base-content">
                        Tokenomics Methodology
                    </h1>
                </div>
                <div className="divider divider-accent"></div>

                <figure>
                    <img
                        src={CONSENSUS_METHOD_CARD}
                        alt="Tokenomics Methodology"
                        className="w-full h-full object-cover opacity-50"
                    />
                </figure>
            </div>

            <div className="card w-full bg-base-200 shadow-md overflow-hidden opacity-80">
                <div className="card-body p-4 text-base">
                    <p>
                        <a
                            href="https://informatics.ed.ac.uk/blockchain/edi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                        >
                            The Edinburgh Decentralization Index (EDI)
                        </a>{" "}
                        is a methodology framework for defining, analyzing, and evaluating the
                        decentralization level of blockchain systems across multiple layers.
                        These layers are: Hardware, Software, Network, Consensus, Tokenomics,
                        Client API, Governance, and Geography.
                    </p>
                    <p className="">
                        This page offers visualizations of the Tokenomics layer results.
                        The ledgers that are currently supported are: Bitcoin, Bitcoin Cash,
                        Cardano, Ethereum, Litecoin, and Tezos. On the Tokenomics layer,
                        decentralization is evaluated based on the distribution of tokens
                        across token holders. The blockchain data that is needed to determine
                        these distributions are collected from{" "}
                        <a href="https://console.cloud.google.com/bigquery">BigQuery</a>{" "}
                        and self-hosted full nodes. For more information on how data is
                        processed you can refer to the documentation of the open-source GitHub
                        repositories for the relevant GitHub{" "}
                        <a href="https://blockchain-technology-lab.github.io/tokenomics-decentralization/">
                            repository
                        </a>{" "}
                        . The dashboard offers various options to the users for customizing
                        the results.
                    </p>
                    <p className="">
                        Historical block data for each blockchain is collected from{" "}
                        <a
                            href="https://console.cloud.google.com/bigquery"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                        >
                            BigQuery
                        </a>{" "}
                        and self-hosted full nodes. Each block is mapped to its creator (see
                        clustering options below), and then the distribution of blocks
                        across entities is calculated for each 30-day interval. Active
                        participants are identified by including those that produced at
                        least one block in the preceding or following window.
                    </p>
                    <p className="">
                        For detailed information, refer to the open-source GitHub{" "}
                        <a
                            href="https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                        >
                            repository
                        </a>
                        .
                    </p>
                </div>
            </div>

            <div className="space-y-12 font-roboto">
                <div className="card bg-base-200 shadow-md font-roboto pt-4">
                    <div className="card-body p-4">
                        <h1 className="text-xl font-bold text-base-content mb-6">
                            Tokenomics layer - Clustering options
                        </h1>
                        <div className="divider divider-accent"></div>
                        <p>
                            A user can choose which off-chain sources to use to attribute
                            blockchain data to real world entities. This enables the clustering of
                            seemingly independent objects under the same identity.On the
                            Tokenomics layer, clustering enables the attribution of multiple
                            independent addresses to the same wallet.
                        </p>
                        <p>
                            Here, the clustering options are: &quot;Explorers&quot;, &quot;Staking
                            keys&quot;, &quot;Multi-input Transactions&quot;, &quot;Crystal
                            Intelligence&quot; and &quot;None&quot;. A user can choose either
                            &quot;None&quot; or any combination of the other options.
                            &quot;Explorers&quot; refers to attribution and deanonymization data
                            collected from blockchain explorers, namely{" "}
                            <a href="https://bitinfocharts.com/">BitInfoCharts</a>,{" "}
                            <a href="https://etherscan.io/">Etherscan</a>,{" "}
                            <a href="https://www.walletexplorer.com/">Wallet Explorer</a>,{" "}
                            <a href="https://dogecoinwhalealert.com/">
                                Dogecoin Whale Alert
                            </a>
                            , <a href="https://tzkt.io/">TzKT</a>.
                        </p>
                        <p>
                            &quot;Staking keys&quot; refers to the data collected from stake pools
                            and validators that are used to attribute staking addresses to the
                            same entity.
                        </p>
                        <p>
                            We have now added the &apos;Multi-input Transactions&apos; clustering
                            option. This feature allows attributing addresses to the same entity
                            when they are used as inputs in the same transaction, a
                            well-established heuristic for clustering addresses in UTXO-based
                            ledgers.
                        </p>
                        <p>
                            Explorer data is used for all ledgers except Cardano, whereas staking
                            keys are used only for Cardano.
                        </p>
                        <p>
                            Additionally, we have introduced a new third-party clustering option
                            called &quot;Crystal Intelligence&quot;. This option leverages
                            advanced clustering algorithms from{" "}
                            <a href="https://crystalintelligence.com/">
                                {" "}
                                Crystal Intelligence & Crypto Compliance
                            </a>{" "}
                            to more accurately group public addresses belonging to the same
                            real-world entity. Unlike the other clustering methods, which are
                            developed in-house, &quot;Crystal Intelligence&quot; is an external
                            integration. You can select &quot;Crystal Intelligence&quot;
                            individually or in combination with our other clustering methods in
                            the Clustering options.
                        </p>
                        <p>By default, all options (except &quot;None&quot;) are applied.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-12 font-roboto">
                <div className="card bg-base-200 shadow-md font-roboto pt-4">
                    <div className="card-body p-4 ">
                        <h1 className="text-2xl font-bold  text-base-content">
                            Tokenomics layer - Thresholding options
                        </h1>
                    </div>
                    <div className="divider divider-accent"></div>
                    <div className="card-body p-4 text-base">
                        <p className="">
                            A user can apply the decentralization metrics on all or part of the data by choosing the relevant inclusion threshold on each layer.

                            For example, if the option "Top 100" is chosen on the Tokenomics layer, then the metrics will apply on the top 100 richest entities in the system, while ignoring the rest. Similarly, if the option "Above $0.01" is chosen in Tokenomics, the metrics will apply on entities that control tokens that were worth, at the given point in time, at least $0.01.

                            Threshold options are: “Top 100”, “Top 1000”, “Top 50%”, “Above $0.01”, “None”.

                            By default, no inclusion threshold is applied.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
