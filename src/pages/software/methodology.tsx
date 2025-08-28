import { CONSENSUS_METHOD_CARD } from "@/utils";

export function SoftwareMethodology() {
    return (
        <div className="space-y-16 font-roboto">
            {/* Header Image Card with Title */}

            <div className="card w-full bg-base-200 shadow-md overflow-hidden h-48">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center text-base-content">
                        Software Methodology
                    </h1>
                </div>
                <div className="divider divider-accent"></div>

                <figure>
                    <img
                        src={CONSENSUS_METHOD_CARD}
                        alt="Software Methodology"
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
                            The Edinburgh Decentralisation Index (EDI)
                        </a>{" "}
                        is a methodology framework for defining, analysing, and evaluating the
                        decentralisation level of blockchain systems across multiple layers.
                        These layers are: Hardware, Software, Network, Consensus, Tokenomics,
                        Client API, Governance, and Geography.
                    </p>
                    <p className="">
                        This page offers visualisations of the Software layer results.
                        This layer is evaluated by looking at the open source repositories
                        that are associated with different blockchain clients, and
                        specifically looking at their commit history. The dashboard currently
                        provides results for the following projects:
                    </p>
                    <ul>
                        <li>
                            <a
                                href="https://github.com/bitcoin/bitcoin"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Bitcoin Core (Bitcoin)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/bitcoin-cash-node/bitcoin-cash-node"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Bitcoin Cash Node (Bitcoin Cash)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/IntersectMBO/cardano-node"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Cardano Node (Cardano)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/ethereum/go-ethereum"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Go Ethereum (Ethereum)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/NethermindEth/nethermind"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Nethermind (Ethereum)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/litecoin-project/litecoin"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Litecoin Core (Litecoin)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/paritytech/polkadot-sdk"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Polkadot SDK (Polkadot)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/solana-labs/solana"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Solana (Solana)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/tezos/tezos-mirror"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Tezos (Tezos)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/zcash/zcash"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Zcash (Zcash)
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="space-y-12 font-roboto">
                <div className="card bg-base-200 shadow-md font-roboto pt-4">
                    <div className="card-body p-4">
                        <h1 className="text-xl font-bold text-base-content mb-6">
                            Software layer - Options
                        </h1>
                        <div className="divider divider-accent"></div>
                        <p>
                            A user can choose which options will be taken into account when
                            generating the graphs. These include:
                        </p>
                        <ul className="list-unstyled">
                            <li>
                                <strong>Sample Window</strong>, i.e. how many consecutive commits to
                                group together before applying a metric. It can be one of: 100, 250,
                                500, 1000.
                            </li>
                            <li>
                                <strong>Contribution Type</strong>, i.e. what counts as a
                                contribution. The options are:
                                <ul className="list-unstyled ms-4">
                                    <li>
                                        <i>
                                            Number of commits: each commit is counted as a single
                                            contribution.
                                        </i>
                                    </li>
                                    <li>
                                        <i>
                                            Number of merge commits: only merge commits are counted as
                                            contributions.
                                        </i>
                                    </li>
                                    <li>
                                        <i>
                                            Lines of code changed: each line of code changed (added or
                                            removed) counts as a contribution. In this case, all commits
                                            are counted, but each is assigned a different contribution
                                            weight, based on the number of updated lines associated with
                                            it.
                                        </i>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>Contributor Type</strong>, i.e. who is seen as responsible
                                for the contribution. Author: the person who wrote the code of the
                                commit. Committer: the person who committed the code on behalf of
                                the original author (can be the same or different from the author).
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
