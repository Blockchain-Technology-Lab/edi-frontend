import { Link, useRouterState } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { router } from "@/router";
import { basePath } from "@/utils/paths";

const BASE_PATH: string = basePath || "";


export function Breadcrumb() {
    const { location } = useRouterState({ router }) as {
        location: { pathname: string };
    };

    const pathname: string = location?.pathname ?? "/";

    const getAppRelativePath = (fullPath: string): string => {
        return BASE_PATH && fullPath.startsWith(BASE_PATH)
            ? fullPath.slice(BASE_PATH.length) || "/"
            : fullPath;
    };

    const appRelativePath: string = getAppRelativePath(pathname);
    const pathSegments: string[] = appRelativePath.split("/").filter(Boolean);



    if (pathSegments.length === 0) return null;

    const getSegmentInfo = (segments: string[], index: number) => {
        const currentPath = '/' + segments.slice(0, index + 1).join('/');
        const segment = segments[index];

        // find the route in the router
        const routes = (router.routeTree.children as unknown as any[]) || [];

        // Helper function to find route recursively
        const findRoute = (routeNodes: any[], targetPath: string): any => {
            for (const route of routeNodes) {
                if (route.path === targetPath || route.fullPath === targetPath) {
                    return route;
                }
                if (route.children) {
                    const found = findRoute(route.children, targetPath);
                    if (found) return found;
                }
            }
            return null;
        };

        const route = findRoute(routes, currentPath);

        // If route has a title or name, use it
        if (route?.options?.title) {
            return {
                label: route.options.title,
                path: currentPath
            };
        }

        // Fallback to smart labeling based on patterns
        const getSmartLabel = (segment: string) => {
            // Special cases
            if (segment === 'methodology') {
                return 'Methodology';
            }
            if (segment === 'infographics') {
                return 'Infographics';
            }

            // Layer detection - if it's a known layer, add "Layer"
            const knownLayers = ['consensus', 'tokenomics', 'network', 'software', 'geography', 'governance'];
            if (knownLayers.includes(segment)) {
                return segment.charAt(0).toUpperCase() + segment.slice(1) + ' Layer';
            }

            // Default: capitalize first letter
            return segment.charAt(0).toUpperCase() + segment.slice(1);
        };

        return {
            label: getSmartLabel(segment),
            path: currentPath
        };
    };

    const isValidRoute = (path: string) => {
        // Basic check if the path could be a valid route
        const validPaths = [
            '/consensus',
            '/tokenomics',
            '/network',
            '/software',
            '/geography',
            '/governance',
            '/infographics'
        ];

        // Check if it's a main layer page
        if (validPaths.includes(path)) return true;

        // Check if it's a methodology page
        if (path.endsWith('/methodology')) {
            const layerPath = path.replace('/methodology', '');
            return validPaths.includes(layerPath);
        }

        return false;
    };

    return (
        <div className="breadcrumbs text-sm mb-4 opacity-70">
            <ul>
                <li>
                    <Link to="/" className="flex items-center gap-1 hover:opacity-100">
                        <Home size={14} />
                        Home
                    </Link>
                </li>
                {pathSegments.map((_, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const segmentInfo = getSegmentInfo(pathSegments, index);
                    const isClickable = !isLast && isValidRoute(segmentInfo.path);

                    return (
                        <li key={index}>
                            {isClickable ? (
                                <Link
                                    to={segmentInfo.path as any}
                                    className="flex items-center gap-1 hover:opacity-100 hover:text-primary"
                                >
                                    {segmentInfo.label}
                                </Link>
                            ) : (
                                <span className={`flex items-center gap-1 ${isLast ? 'font-medium' : ''}`}>
                                    {segmentInfo.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}