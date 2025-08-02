import { DoughnutChartRenderer, GitHubButton } from "@/components";

interface RepositoryCardProps {
    repoItem: {
        name: string;
        url: string;
        repo: string
    };
    path: string;
    fileName: string;
}

export function RepositoryCard({ repoItem, path, fileName }: RepositoryCardProps) {
    return (
        <div className="card-body m-1" key={repoItem.name} title={repoItem.name}>
            <div className="flex justify-between items-center shadow-lg text-2xl card-title bg-base-300 alert w-full mb-4">
                <span>{repoItem.name}</span>
                <GitHubButton url={repoItem.url} />
            </div>

            {/* Error boundary for individual charts */}
            {path ? (
                <DoughnutChartRenderer
                    key={repoItem.name}
                    path={path}
                    fileName={fileName}
                />
            ) : (
                <div className="alert alert-warning">
                    <span>Chart data not available for {repoItem.name}</span>
                </div>
            )}
        </div>
    );
}
