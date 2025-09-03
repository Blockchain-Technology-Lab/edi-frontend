import { DoughnutChartRenderer, GitHubButton } from "@/components";
import type { LayerType } from "@/utils";
import Tippy from "@tippyjs/react";
import { Info } from "lucide-react";

interface DoughnutCardProps {
    type: LayerType
    title: string;
    path: string;
    fileName: string;
    githubUrl?: string;
    description?: string;
    showInfo?: boolean;
}

export function DoughnutCard({
    type,
    title,
    path,
    fileName,
    githubUrl,
    description,
    showInfo = false
}: DoughnutCardProps) {
    return (
        <div className="card-body m-1" key={title} title={title}>
            <div className="flex justify-between items-center shadow-lg text-2xl card-title bg-base-300 alert w-full mb-4">
                <span>{title}</span>

                <div className="flex gap-2">
                    {/* Info button with tooltip if description provided */}
                    {showInfo && description && (
                        <Tippy content={description} placement="bottom">
                            <button
                                type="button"
                                tabIndex={0}
                                className="btn btn-circle btn-ghost btn-sm text-base-content hover:text-accent"
                                aria-label={`Info about "${title}"`}
                            >
                                <Info size={16} />
                            </button>
                        </Tippy>
                    )}

                    {/* GitHub button if URL provided */}
                    {githubUrl && <GitHubButton url={githubUrl} />}
                </div>
            </div>

            {/* Error boundary for individual charts */}
            {path ? (
                <DoughnutChartRenderer
                    type={type}
                    key={title}
                    path={path}
                    fileName={fileName}
                />
            ) : (
                <div className="alert alert-warning">
                    <span>Chart data not available for {title}</span>
                </div>
            )}
        </div>
    );
}
