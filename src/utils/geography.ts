import type { DataEntry, DoughnutDataEntry } from '@/utils/types';

const GEOGRAPHY_DISTRIBUTION_PREFIX = 'countries';

export const GEOGRAPHY_COUNTRIES_COLUMNS = [
  'entropy=1',
  'hhi',
  'nakamoto_coefficient',
  'max_power_ratio',
];

export const GEOGRAPHY_METRICS = [
  {
    metric: 'hhi',
    title: 'HHI',
    description:
      'The Herfindahl-Hirschman Index (HHI) is a measure of market concentration. It is defined as the sum of the squares of the market shares (as whole numbers, e.g. 40 for 40%) of the entities in the system. Values close to 0 indicate low concentration (many countries host a similar number of nodes) and values close to 10,000 indicate high concentration (one country hosts most or all nodes).',
    decimals: 0,
    padYAxis: false,
  },
  {
    metric: 'nakamoto_coefficient',
    title: 'Nakamoto Coefficient',
    description:
      'The Nakamoto coefficient represents the minimum number of countries that collectively host more than 50% of the resources (in this case, nodes).',
    decimals: 0,
    padYAxis: true,
  },
  {
    metric: 'max_power_ratio',
    title: '1-concentration ratio',
    description:
      'The 1-concentration ratio represents the share of nodes that are owned by the single most "powerful" country, i.e., the country that hosts the most nodes.',
    decimals: 2,
    padYAxis: false,
  },
  {
    metric: 'entropy_1',
    title: 'Shannon Entropy',
    description:
      'Shannon entropy represents the expected amount of information in a distribution. Higher values indicate more decentralisation (lower predictability).',
    decimals: 2,
    padYAxis: false,
  },
];

export function getGeographyCsvFileName(
  ledger: string,
  options?: { withoutTor?: boolean }
): string {
  const fileNamePrefix = 'output_countries';
  let fileName = `${fileNamePrefix}_${ledger}.csv`;

  if (options?.withoutTor) {
    fileName = `${fileNamePrefix}_${ledger}_without_tor.csv`;
  }

  return fileName;
}

export async function loadGeographyCsvData(
  fileName: string,
  overrideLedgerName?: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName);

    if (!response.ok) {
      throw new Error(`Error loading geography data for ${fileName}`);
    }

    const csvData = await response.text();
    return parseGeographyCSV(csvData, overrideLedgerName);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export function parseGeographyCSV(
  csvData: string,
  overrideLedgerName?: string
): DataEntry[] {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');

  const data: DataEntry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) continue;

    const entry: DataEntry = {} as DataEntry;

    headers.forEach((header, index) => {
      const value = values[index].trim();
      const key = header.trim();

      if (key === 'date') {
        entry.date = new Date(value);
      } else if (key === 'ledger') {
        entry.ledger = overrideLedgerName || value;
      } else if (GEOGRAPHY_COUNTRIES_COLUMNS.includes(key)) {
        entry[key.replace('=', '_')] = parseFloat(value);
      }
    });

    data.push(entry);
  }

  data.sort((a, b) => {
    if (!a.ledger || !b.ledger) return 0;
    return a.ledger.localeCompare(b.ledger);
  });

  return data;
}

export async function loadCountryNodesDoughnutData(
  fileName: string
): Promise<DoughnutDataEntry[]> {
  const response = await fetch(fileName);
  if (!response.ok) {
    throw new Error(`Failed to load ${fileName}`);
  }

  const csv = await response.text();
  return parseCountryNodesDoughnutCSV(csv);
}

export function parseCountryNodesDoughnutCSV(
  csvData: string
): DoughnutDataEntry[] {
  const lines = csvData.trim().split('\n');
  const [, dateLine] = lines;
  const dataLines = lines.slice(2);
  console.log('dateLine:', dateLine); // Debugging line to check the date line

  return dataLines.map((line) => {
    const [label, value] = line.split(',');
    return {
      author: label.trim(), // You may rename this to `label` if preferred
      commits: parseInt(value.trim(), 10),
    };
  });
}

export function getGeographyDoughnutCsvFileName(ledger: string): string {
  return `${GEOGRAPHY_DISTRIBUTION_PREFIX}_${ledger}.csv`;
}
