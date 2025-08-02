import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { RADAR_CSV } from '@/utils';

export interface RadarDataPoint {
  protocol: string;
  consensus: number;
  tokenomics: number;
  software: number;
  network: number;
  geography: number;
}

interface UseRadarCsvReturn {
  data: RadarDataPoint[];
  loading: boolean;
  error: string | null;
}

export function useRadarCsv(csvPath: string = RADAR_CSV): UseRadarCsvReturn {
  const [data, setData] = useState<RadarDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(csvPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status}`);
        }

        const csvText = await response.text();

        Papa.parse<Record<string, any>>(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            try {
              const parsedData: RadarDataPoint[] = [];

              // Check if we have data
              if (!results.data || results.data.length === 0) {
                setError('No data found in CSV file');
                return;
              }

              // Get the protocol names (exclude empty column name)
              const firstRow = results.data[0];
              const protocols = Object.keys(firstRow).filter(
                (key) => key !== '' && key.trim() !== ''
              );

              //console.log('Found protocols:', protocols); // Debug log

              // Transform data from rows to protocol objects
              protocols.forEach((protocol) => {
                const protocolData: RadarDataPoint = {
                  protocol: protocol,
                  consensus: 0,
                  tokenomics: 0,
                  software: 0,
                  network: 0,
                  geography: 0,
                };

                // Find values for each metric
                results.data.forEach((row) => {
                  const metric = (row[''] as string)?.toLowerCase()?.trim();
                  const value = parseFloat(row[protocol]) || 0;

                  if (
                    metric &&
                    metric in protocolData &&
                    metric !== 'protocol'
                  ) {
                    (protocolData as any)[metric] = value;
                  }
                });

                parsedData.push(protocolData);
              });

              //console.log('Parsed radar data:', parsedData); // Debug log
              setData(parsedData);
            } catch (parseError) {
              console.error('Error parsing radar CSV data:', parseError);
              setError('Failed to parse CSV data');
            }
          },
          error: (error: Error) => {
            console.error('Papa Parse error:', error);
            setError(
              `Failed to parse CSV file: ${error.message || 'Unknown error'}`
            );
          },
        });
      } catch (fetchError) {
        console.error('Error fetching radar CSV:', fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to fetch data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [csvPath]);

  return { data, loading, error };
}
