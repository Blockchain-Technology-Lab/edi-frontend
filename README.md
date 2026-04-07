# Edinburgh Decentralisation Index (EDI)

The Edinburgh Decentralisation Index ([EDI](https://informatics.ed.ac.uk/blockchain/edi)) collects stratified metrics describing the decentralisation of blockchain systems.

## Public URLs

- http://blockchainlab.inf.ed.ac.uk/edi-dashboard/
- https://groups.inf.ed.ac.uk/blockchainlab/edi-dashboard/

## Code repos

- [Consensus Layer](https://github.com/Blockchain-Technology-Lab/consensus-decentralization)
- [Tokenomics Layer](https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization)
- [Software Layer](https://github.com/Blockchain-Technology-Lab/software-decentralization)
- [Network and Geography Layers](https://github.com/Blockchain-Technology-Lab/network-decentralization.git)

## Version

- V1 (21-07-2025)

## Team

The [EDI team](https://informatics.ed.ac.uk/blockchain/edi/team) includes specialist researchers, scientists and engineers.

## Website stack

This project is a React + TypeScript frontend built with [Vite](https://vite.dev/).

## Getting started

These instructions help you run the project locally for development and production checks.

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ (CI runs on Node 22)

### Installation

```bash
npm install
```

### Common commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

Notes:

- Vite dev server defaults to http://localhost:5173 unless configured otherwise.
- This repository's default build output is configured in vite.config.ts (currently upload/demo).

## Build and deployment helpers

After building, deployment-oriented scripts are available:

```bash
node demo-build.mjs --deploy
node multi-build.mjs --deploy
```

## Project structure

- src/pages: Route-level page components.
- src/components: Shared and layer-specific UI components.
- src/hooks: Data loading, chart wiring, and interaction hooks.
- src/utils: CSV parsing, data transforms, and chart metadata/constants.
- public/output: Layer CSV inputs consumed by the app.

## Adding a new page

Add a new component under src/pages and wire it into the app routing setup (TanStack Router is used in this project).

Examples:

- src/pages/consensus/index.tsx
- src/pages/methodology.tsx

## Adding or updating data sources

Examples of chart pages and data flow can be found in:

- src/pages/index.tsx
- src/pages/consensus/index.tsx

CSV-related notes:

- CSV files live under public/output.
- Layer-specific filename mapping and parsing are maintained in:
  - src/utils/tokenomics.ts
  - src/utils/consensus.ts
  - src/utils/software.ts
  - src/utils/network.ts
  - src/utils/geography.ts
- Shared parsing helpers live in src/utils/csvParsing.ts.

Chart metadata and color definitions:

- src/utils/charts/constants.ts

## CI and data validation

This repository includes GitHub Actions workflows:

- CI workflow: .github/workflows/ci.yml
  - Type check
  - ESLint (src)
  - Production build

- CSV validation workflow: .github/workflows/csv-validation.yml
  - Runs when files in public/output/\*_/_.csv change
  - Executes scripts/validate-csvs.mjs

You can run the CSV validation locally:

```bash
node scripts/validate-csvs.mjs
```
