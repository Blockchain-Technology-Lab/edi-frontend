# Edinburgh Decentralisation Index (EDI)

The Edinburgh Decentralisation Index ([EDI](https://informatics.ed.ac.uk/blockchain/edi)) collects stratified metrics describing the decentralisation of blockchain systems.

## Public URLs

- http://blockchainlab.inf.ed.ac.uk/edi-dashboard/
- https://groups.inf.ed.ac.uk/blockchainlab/edi-dashboard/

## Code repos

- [Consensus Layer](https://github.com/Blockchain-Technology-Lab/consensus-decentralization)
- [Tokenomics Layer](https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization)
- [Software Layer](https://github.com/Blockchain-Technology-Lab/software-decentralization)

## Version

- V1 (21-07-2025)

## Team

The [EDI team](https://informatics.ed.ac.uk/blockchain/edi/team) includes specialist researchers, scientists and engineers.

## Website

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

These instructions will help you set up and run the project on your local machine for development and production purposes.

#### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v20.14 or later)
#### Installation

```bash
npm install
```

#### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start the server on [http://localhost:3000](http://localhost:3000). The page will reload if you make edits. You will also see any lint errors in the console.

#### Building for Production

```bash
npm build
```

This will generate an optimized version of your application in the `/dist` folder, ready to be deployed. It can be hosted on any web server that can serve HTML/CSS/JS static assets. Read more more about [static exports](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) and [deployments](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#deploying).

#### Demo Production

After building the project, you can preview the production build with:

```bash
node demo-build.mjs --deploy
```

#### Multi-build Production

After building the project, you can preview the production build with:

```bash
node multi-build.mjs --deploy
```

The production server will run on [http://localhost:3000](http://localhost:3000).

### Adding a new page

In Next.js, pages are created by adding files to the `pages` directory. Each file inside this directory automatically becomes a route that corresponds to its file path.

If you create `src/pages/about.tsx` that exports a React component like below, it will be accessible at `/about`.

```tsx
export default function About() {
  return <div>About</div>
}
```

For nested routes, you can create a nested folder structure and files will automatically be routed in the same way.

- `src/pages/consensus/index.tsx` → `/consensus`
- `src/pages/consensus/methodology.tsx` → `/consensus/methodology`

**Examples**

Please see `src/pages/methodology.tsx` and `src/pages/accessibility.tsx` for examples on how a static page can be structured.

[Learn more about Next.js pages](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)

### Adding a new data source

Examples on how charts pages are structured can be found under `src/pages/index.tsx` and `src/pages/consensus/index.tsx`.

**CSV files:**

- All `.csv` files can be found under `public/output/`
- The filter/csv mapping happens under the `getTokenomicsCsvFileName` and can be found on `src/utils/csv.tsx`
- CSV data will be parsed according to the columns defined under `TOKENOMICS_COLUMNS` and `CONSENSUS_COLUMNS` on `src/utils/csv.tsx`

**Chart data:**

- Labels and datasets for each chart are built using the function `getChartData`
- They are built based on ledgers and colours defined on `src/utils/charts/constants.ts`