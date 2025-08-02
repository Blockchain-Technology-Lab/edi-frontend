import { CONSENSUS_METHOD_CARD } from "@/utils";

export function GeographyMethodology() {
    return (
        <div className="space-y-16 font-roboto">
            {/* Header Image Card with Title */}

            <div className="card w-full bg-base-200 shadow-md overflow-hidden h-48">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center text-base-content">
                        Geography Methodology
                    </h1>
                </div>
                <div className="divider divider-accent"></div>

                <figure>
                    <img
                        src={CONSENSUS_METHOD_CARD}
                        alt="Geography Methodology"
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
                    <p>
                        This page offers visualizations of the Geography layer results.
                        The ledgers that are currently supported are: Bitcoin, Bitcoin Cash,
                        Litecoin, Dogecoin and Zcash. On the Geography layer, decentralization
                        is evaluated based on the distribution of nodes across countries. The
                        blockchain data that is needed to determine these distributions are
                        collected using a crawler running on each network. The crawler is
                        based on the{" "}
                        <a href="https://github.com/ayeowch/bitnodes">Bitnodes</a>{" "}
                        project. The following metrics are presented in the dashboard: the
                        Herfindahl-Hirschman index (HHI), the Nakamoto coefficient, the
                        1-concentration ratio and the Shannon entropy. The results are based
                        only on data we have collected and do not include extensive historical
                        data.
                    </p>
                    <p>
                        Regarding the Bitcoin network, more than half of the nodes use Tor
                        (see <a href="">Countries Distribution</a>), and it is
                        impossible to know in which countries they are located. For the
                        metrics, it was therefore decided to distribute these nodes
                        proportionally among the different countries.
                    </p>

                </div>
            </div>


        </div>
    );
}
