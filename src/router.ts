import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { basePath } from '@/utils/paths';

import { lazy } from 'react';

import { RootLayout } from '@/components';
import HomePage from './pages';

//const basePath = "/blockchainlab/demo";

export function withBase(path: string) {
  return `${basePath}${path}`;
}

const Consensus = lazy(() =>
  import('@/pages/consensus').then((mod) => ({ default: mod.Consensus }))
);

const ConsensusMethodology = lazy(() =>
  import('@/pages/consensus/methodology').then((mod) => ({
    default: mod.ConsensusMethodology,
  }))
);

const Tokenomics = lazy(() =>
  import('@/pages/tokenomics').then((mod) => ({ default: mod.Tokenomics }))
);

const TokenomicsMethodology = lazy(() =>
  import('@/pages/tokenomics/methodology').then((mod) => ({
    default: mod.TokenomicsMethodology,
  }))
);

const Network = lazy(() =>
  import('@/pages/network').then((mod) => ({ default: mod.Network }))
);

const NetworkMethodology = lazy(() =>
  import('@/pages/network/methodology').then((mod) => ({
    default: mod.NetworkMethodology,
  }))
);

const Software = lazy(() =>
  import('@/pages/software').then((mod) => ({ default: mod.Software }))
);

const SoftwareMethodology = lazy(() =>
  import('@/pages/software/methodology').then((mod) => ({
    default: mod.SoftwareMethodology,
  }))
);

const Geography = lazy(() =>
  import('@/pages/geography').then((mod) => ({ default: mod.Geography }))
);

const GeographyMethodology = lazy(() =>
  import('@/pages/geography/methodology').then((mod) => ({
    default: mod.GeographyMethodology,
  }))
);

const Governance = lazy(() =>
  import('@/pages/governance').then((mod) => ({ default: mod.Governance }))
);

const GovernanceMethodology = lazy(() =>
  import('@/pages/governance/methodology').then((mod) => ({
    default: mod.GovernanceMethodology,
  }))
);
/*
const Hardware = lazy(() =>
  import('@/pages/hardware').then((mod) => ({ default: mod.Hardware }))
);
*/

const Accessiblity = lazy(() =>
  import('@/pages/accessibility').then((mod) => ({
    default: mod.AccessibilityStatement,
  }))
);

const Changelog = lazy(() =>
  import('@/pages/changelog').then((mod) => ({
    default: mod.Changelog,
  }))
);

const Infographics = lazy(() =>
  import('@/pages/infographics').then((mod) => ({
    default: mod.Infographics,
  }))
);

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const indexRoute = createRoute({
  path: withBase('/'),
  getParentRoute: () => rootRoute,
  component: HomePage,
});

export const consensusRoute = createRoute({
  path: withBase('/consensus'),
  getParentRoute: () => rootRoute,
  component: Consensus,
});

export const consensusMethodologyRoute = createRoute({
  path: withBase('/consensus/methodology'),
  getParentRoute: () => rootRoute,
  component: ConsensusMethodology,
});

export const tokenomicsRoute = createRoute({
  path: withBase('/tokenomics'),
  getParentRoute: () => rootRoute,
  component: Tokenomics,
});

export const tokenomicsMethodologyRoute = createRoute({
  path: withBase('/tokenomics/methodology'),
  getParentRoute: () => rootRoute,
  component: TokenomicsMethodology,
});

export const networkRoute = createRoute({
  path: withBase('/network'),
  getParentRoute: () => rootRoute,
  component: Network,
});

export const networkMethodologyRoute = createRoute({
  path: withBase('/network/methodology'),
  getParentRoute: () => rootRoute,
  component: NetworkMethodology,
});

export const networkContributorRoute = createRoute({
  path: `contributor`,
  getParentRoute: () => networkRoute,
  component: Network,
});

export const softwareRoute = createRoute({
  path: withBase('/software'),
  getParentRoute: () => rootRoute,
  component: Software,
});

export const softwareMethodologyRoute = createRoute({
  path: withBase('/software/methodology'),
  getParentRoute: () => rootRoute,
  component: SoftwareMethodology,
});

export const softwareContributorRoute = createRoute({
  path: `contributor`,
  getParentRoute: () => softwareRoute,
  component: Software,
});

export const geographyRoute = createRoute({
  path: withBase('/geography'),
  getParentRoute: () => rootRoute,
  component: Geography,
});

export const geographyMethodologyRoute = createRoute({
  path: withBase('/geography/methodology'),
  getParentRoute: () => rootRoute,
  component: GeographyMethodology,
});

export const geographyContributorRoute = createRoute({
  path: `contributor`,
  getParentRoute: () => geographyRoute,
  component: Geography,
});

export const governanceRoute = createRoute({
  path: withBase('/governance'),
  getParentRoute: () => rootRoute,
  component: Governance,
});

export const governanceMethodologyRoute = createRoute({
  path: withBase('/governance/methodology'),
  getParentRoute: () => rootRoute,
  component: GovernanceMethodology,
});
/*
export const hardwareRoute = createRoute({
  path: withBase("/hardware"),
  getParentRoute: () => rootRoute,
  component: Hardware,
});
*/

export const accessibilityRoute = createRoute({
  path: withBase('/accessibility'),
  getParentRoute: () => rootRoute,
  component: Accessiblity,
});

export const changelogRoute = createRoute({
  path: withBase('/changelog'),
  getParentRoute: () => rootRoute,
  component: Changelog,
});

export const infographicsRoute = createRoute({
  path: withBase('/infographics'),
  getParentRoute: () => rootRoute,
  component: Infographics,
});

// Route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  consensusRoute,
  consensusMethodologyRoute,
  tokenomicsRoute,
  tokenomicsMethodologyRoute,
  networkRoute.addChildren([networkContributorRoute]),
  networkMethodologyRoute,
  softwareRoute.addChildren([softwareContributorRoute]),
  softwareMethodologyRoute,
  geographyRoute.addChildren([geographyContributorRoute]),
  geographyMethodologyRoute,
  governanceRoute,
  governanceMethodologyRoute,
  accessibilityRoute,
  changelogRoute,
  infographicsRoute,
  // hardwareRoute,
]);

export const router = createRouter({
  routeTree,
  basepath: basePath,
  defaultPreload: 'intent',
  context: { auth: undefined! },
});

// Required for HMR
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
