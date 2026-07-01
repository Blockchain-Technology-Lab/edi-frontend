import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect
} from '@tanstack/react-router'
import { basePath } from '@/utils/paths'

import { lazy } from 'react'

import { RootLayout } from '@/components'
import HomePage from './pages'
import { LAYER_CONFIG, type LayerKey } from '@/config/layers'

//const basePath = "/blockchainlab/demo";

export function withBase(path: string) {
  return `${basePath}${path}`
}

// Throws a redirect to home when the layer is disabled.
function guardLayer(key: LayerKey) {
  return {
    beforeLoad: () => {
      if (!LAYER_CONFIG[key].enabled) {
        throw redirect({ to: withBase('/') })
      }
    }
  }
}

const Methodology = lazy(() =>
  import('@/pages/methodology').then((mod) => ({ default: mod.Methodology }))
)

const Consensus = lazy(() =>
  import('@/pages/consensus').then((mod) => ({ default: mod.Consensus }))
)

const Tokenomics = lazy(() =>
  import('@/pages/tokenomics').then((mod) => ({ default: mod.Tokenomics }))
)

const Network = lazy(() =>
  import('@/pages/network').then((mod) => ({ default: mod.Network }))
)

const Software = lazy(() =>
  import('@/pages/software').then((mod) => ({ default: mod.Software }))
)

const Geography = lazy(() =>
  import('@/pages/geography').then((mod) => ({ default: mod.Geography }))
)

const Governance = lazy(() =>
  import('@/pages/governance').then((mod) => ({ default: mod.Governance }))
)

const Accessiblity = lazy(() =>
  import('@/pages/accessibility').then((mod) => ({
    default: mod.AccessibilityStatement
  }))
)

const Changelog = lazy(() =>
  import('@/pages/changelog').then((mod) => ({
    default: mod.Changelog
  }))
)

const Infographics = lazy(() =>
  import('@/pages/infographics').then((mod) => ({
    default: mod.Infographics
  }))
)

export const rootRoute = createRootRoute({
  component: RootLayout
})

export const indexRoute = createRoute({
  path: withBase('/'),
  getParentRoute: () => rootRoute,
  component: HomePage
})

export const methodologyRoute = createRoute({
  path: withBase('/methodology'),
  getParentRoute: () => rootRoute,
  component: Methodology
})

export const consensusRoute = createRoute({
  ...guardLayer('consensus'),
  path: withBase('/consensus'),
  getParentRoute: () => rootRoute,
  component: Consensus
})

export const consensusMethodologyRoute = createRoute({
  ...guardLayer('consensus'),
  path: `consensus`,
  getParentRoute: () => methodologyRoute,
  component: Methodology
})

export const tokenomicsRoute = createRoute({
  ...guardLayer('tokenomics'),
  path: withBase('/tokenomics'),
  getParentRoute: () => rootRoute,
  component: Tokenomics
})

export const tokenomicsMethodologyRoute = createRoute({
  ...guardLayer('tokenomics'),
  path: `tokenomics`,
  getParentRoute: () => methodologyRoute,
  component: Methodology
})

export const networkRoute = createRoute({
  ...guardLayer('network'),
  path: withBase('/network'),
  getParentRoute: () => rootRoute,
  component: Network
})

export const networkMethodologyRoute = createRoute({
  ...guardLayer('network'),
  path: `network`,
  getParentRoute: () => methodologyRoute,
  component: Methodology
})

export const networkContributorRoute = createRoute({
  path: `contributor`,
  getParentRoute: () => networkRoute,
  component: Network
})

export const softwareRoute = createRoute({
  ...guardLayer('software'),
  path: withBase('/software'),
  getParentRoute: () => rootRoute,
  component: Software
})

export const softwareMethodologyRoute = createRoute({
  ...guardLayer('software'),
  path: `software`,
  getParentRoute: () => methodologyRoute,
  component: Methodology
})

export const softwareContributorRoute = createRoute({
  path: `contributor`,
  getParentRoute: () => softwareRoute,
  component: Software
})

export const geographyRoute = createRoute({
  ...guardLayer('geography'),
  path: withBase('/geography'),
  getParentRoute: () => rootRoute,
  component: Geography
})

export const geographyMethodologyRoute = createRoute({
  ...guardLayer('geography'),
  path: `geography`,
  getParentRoute: () => methodologyRoute,
  component: Methodology
})

export const geographyContributorRoute = createRoute({
  path: `contributor`,
  getParentRoute: () => geographyRoute,
  component: Geography
})

export const governanceRoute = createRoute({
  ...guardLayer('governance'),
  path: withBase('/governance'),
  getParentRoute: () => rootRoute,
  component: Governance
})

export const governanceMethodologyRoute = createRoute({
  ...guardLayer('governance'),
  path: `governance`,
  getParentRoute: () => methodologyRoute,
  component: Methodology
})

export const accessibilityRoute = createRoute({
  path: withBase('/accessibility'),
  getParentRoute: () => rootRoute,
  component: Accessiblity
})

export const changelogRoute = createRoute({
  path: withBase('/changelog'),
  getParentRoute: () => rootRoute,
  component: Changelog
})

export const infographicsRoute = createRoute({
  path: withBase('/infographics'),
  getParentRoute: () => rootRoute,
  component: Infographics
})

// Route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  consensusRoute,
  tokenomicsRoute,
  networkRoute.addChildren([networkContributorRoute]),
  softwareRoute.addChildren([softwareContributorRoute]),
  geographyRoute.addChildren([geographyContributorRoute]),
  governanceRoute,
  accessibilityRoute,
  changelogRoute,
  infographicsRoute,
  methodologyRoute.addChildren([
    consensusMethodologyRoute,
    tokenomicsMethodologyRoute,
    networkMethodologyRoute,
    softwareMethodologyRoute,
    geographyMethodologyRoute,
    governanceMethodologyRoute
  ])
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultViewTransition: true,
  context: { auth: undefined! }
})

// Required for HMR
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
