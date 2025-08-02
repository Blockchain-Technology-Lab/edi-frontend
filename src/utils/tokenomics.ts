import type { DataEntry } from '@/utils/types';

const TOKENOMICS_COLUMNS = [
  'hhi',
  'shannon_entropy',
  'gini',
  'tau=0.5',
  'tau=0.66',
  'mpr',
  'theil',
];

const TOKENOMICS_ALLOWED_LEDGERS = [
  'bitcoin',
  'bitcoin_cash',
  'cardano',
  'dogecoin',
  'ethereum',
  'litecoin',
  'tezos',
];

export const TOKENOMICS_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents the degree of inequality in a distribution. Values close to 0 indicate equality (all entities in the system control the same amount of assets) and values close to 1 indicate inequality (one entity holds most or all tokens).',
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy (also known as information entropy) represents the expected amount of information in a distribution . Typically, a higher value of entropy indicates higher decentralisation (lower predictability).',
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) is a measure of market concentration. It is defined as the sum of the squares of the market shares (as whole numbers, e.g. 40 for 40%) of the entities in the system. Values close to 0 indicate low concentration (many entities hold a similar number of tokens) and values close to 10,000 indicate high concentration (one entity controls most or all tokens).',
  },
  /*{
    metric: 'theil',
    title: 'Theil index',
    decimals: 0,
    description:
      'The Theil index captures the lack of diversity, or the redundancy, in a population. In practice, it is calculated as the maximum possible entropy minus the observed entropy. Values close to 0 indicate equality and values towards infinity indicate inequality.',
  }, */
  {
    metric: 'mpr',
    title: '1-concentration ratio',
    decimals: 2,
    description:
      'The 1-concentration ratio represents the share of tokens that are owned by the single most “powerful” entity, i.e. the wealthiest entity.',
  },
  {
    metric: 'tau=0.5',
    title: 'Nakamoto coefficient',
    decimals: 0,
    description:
      'The Nakamoto coefficient represents the minimum number of entities that collectively control more than 50% of the resources (in this case, the majority of circulating tokens at a given point in time).',
  },
  {
    metric: 'tau=0.66',
    title: 'τ-decentralisation index',
    decimals: 0,
    description:
      'The τ-decentralisation index is a generalization of the Nakamoto coefficient. It is defined as the minimum number of entities that collectively control more than a fraction τ of the total resources (in this case more than 66% of the total tokens in circulation).',
  },
];

export type ClusteringOption = 'explorers' | 'staking' | 'multi' | 'crystal';

/**
 * Parses the tokenomics CSV content into DataEntry[]
 */
export function parseTokenomicsCsv(csv: string): DataEntry[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  const data: DataEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) continue;

    const entry: { [key: string]: any } = {};
    let ledger: string | undefined;

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = values[j].trim();

      if (header === 'date') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date: "${value}" at row ${i}`);
          continue;
        }
        entry.date = date;
      } else if (header === 'ledger') {
        ledger = value;
        entry.ledger = value;
      } else if (TOKENOMICS_COLUMNS.includes(header)) {
        const parsed = parseFloat(value);
        entry[header] = isNaN(parsed) ? null : parsed;
      }
    }

    // Only include entries with valid date and allowed ledger
    if (entry.date && ledger && TOKENOMICS_ALLOWED_LEDGERS.includes(ledger)) {
      data.push(entry as DataEntry);
    }
  }

  return data.sort(sortByLedgerAndDate);
}

/**
 * Loads and parses the tokenomics CSV file from a given path.
 */
export async function loadTokenomicsCsvData(
  fileName: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName);

    if (!response.ok) {
      throw new Error(`Error loading tokenomics data from ${fileName}`);
    }

    const csvText = await response.text();
    return parseTokenomicsCsv(csvText);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

/**
 * Determines the correct file name based on selected clustering & threshold
 */
export function getTokenomicsCsvFileName(
  threshold: string,
  clustering: ClusteringOption[]
): string {
  const fileSuffixes: Record<string, string> = {
    '100': 'output-absolute_100.csv',
    '1000': 'output-absolute_1000.csv',
    '50p': 'output-percentage_0.5.csv',
    above: 'output-exclude_below_usd_cent.csv',
    none: 'output.csv',
  };

  //const clusteringKey = clustering.slice().sort().join('-');

  const directoryMapping: Record<string, string> = {
    '': 'no_clustering',
    crystal: 'crystal',
    'crystal-explorers': 'crystal_explorers',
    'crystal-explorers-multi': 'crystal_explorers_multi_input_transactions',
    'crystal-explorers-multi-staking':
      'crystal_explorers_staking_keys_multi_input_transactions',
    'crystal-explorers-staking': 'crystal_explorers_staking_keys',
    'crystal-multi': 'crystal_multi_input_transactions',
    'crystal-multi-staking': 'crystal_staking_keys_multi_input_transactions',
    'crystal-staking': 'crystal_staking_keys',
    explorers: 'explorers',
    'explorers-crystal': 'crystal_explorers',
    'explorers-crystal-multi': 'crystal_explorers_multi_input_transactions',
    'explorers-crystal-staking': 'crystal_explorers_staking_keys',
    'explorers-multi': 'explorers_multi_input_transactions',
    'explorers-multi-crystal': 'crystal_explorers_multi_input_transactions',
    'explorers-multi-staking':
      'explorers_staking_keys_multi_input_transactions',
    'explorers-staking': 'explorers_staking_keys',
    'explorers-staking-crystal': 'crystal_explorers_staking_keys',
    'explorers-staking-multi':
      'explorers_staking_keys_multi_input_transactions',
    'explorers-staking-multi-crystal':
      'crystal_explorers_staking_keys_multi_input_transactions',
    multi: 'multi_input_transactions',
    'multi-crystal': 'crystal_multi_input_transactions',
    'multi-crystal-explorers': 'crystal_explorers_multi_input_transactions',
    'multi-crystal-staking': 'crystal_staking_keys_multi_input_transactions',
    'multi-staking': 'staking_keys_multi_input_transactions',
    'multi-staking-crystal': 'crystal_staking_keys_multi_input_transactions',
    staking: 'staking_keys',
    'staking-crystal': 'crystal_staking_keys',
    'staking-crystal-multi': 'crystal_staking_keys_multi_input_transactions',
    'staking-multi': 'staking_keys_multi_input_transactions',
    'staking-multi-crystal': 'crystal_staking_keys_multi_input_transactions',
  };

  const createKey = (arr: ClusteringOption[]): string =>
    arr.slice().sort().join('-');
  const sortedClusteringKey = createKey(clustering);
  const directory = directoryMapping[sortedClusteringKey] || 'no_clustering';
  const fileName = fileSuffixes[threshold] || 'output-absolute_1000.csv';

  return `${directory}/${fileName}`;
}

function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerA = a.ledger || '';
  const ledgerB = b.ledger || '';

  const ledgerCompare = ledgerA.localeCompare(ledgerB);
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime();
}
