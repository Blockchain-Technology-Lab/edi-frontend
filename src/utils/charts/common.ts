import {
  CONSENSUS_COLOURS,
  CONSENSUS_LEDGER_NAMES,
  TOKENOMICS_COLOURS,
  TOKENOMICS_LEDGER_NAMES,
  SOFTWARE_COLOURS,
  SOFTWARE_LEDGER_NAMES,
  NETWORK_LEDGER_NAMES,
  NETWORK_COLOURS,
  LINECHART_WATERMARK_WHITE,
  LINECHART_WATERMARK_BLACK,
  GEOGRAPHY_LEDGER_NAMES,
  GEOGRAPHY_COLOURS,
  GOVERNANCE_LEDGER_NAMES,
  GOVERNANCE_COLOURS,
} from '@/utils';

import type { Plugin } from 'chart.js';
//import type { DataEntry } from '@/utils';
import type { DataEntry } from '@/utils/types';

type LedgerDataset = {
  label: string;
  data: { x: Date; y: number }[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  pointRadius?: number; // Add this
  pointHoverRadius?: number;
};

type LedgerDatasets = {
  [key: string]: LedgerDataset;
};

export const LAYER_TYPES = [
  'tokenomics',
  'consensus',
  'software',
  'network',
  'geography',
  'governance',
] as const;

export type LayerType = (typeof LAYER_TYPES)[number];

export type ChartData = {
  labels: Date[];
  datasets: LedgerDataset[];
};

export function getChartData(
  metric: string,
  type: LayerType,
  data: DataEntry[]
) {
  if (!data) return;
  const { minValue, maxValue } = findMinMaxValues(data);

  let ledgerColorMap;
  switch (type) {
    case 'tokenomics':
      ledgerColorMap = getLedgerColorMap(
        TOKENOMICS_LEDGER_NAMES,
        TOKENOMICS_COLOURS
      );
      break;
    case 'consensus':
      ledgerColorMap = getLedgerColorMap(
        CONSENSUS_LEDGER_NAMES,
        CONSENSUS_COLOURS
      );
      break;
    case 'software':
      ledgerColorMap = getLedgerColorMap(
        SOFTWARE_LEDGER_NAMES,
        SOFTWARE_COLOURS
      );
      break;
    case 'network':
      ledgerColorMap = getLedgerColorMap(NETWORK_LEDGER_NAMES, NETWORK_COLOURS);
      break;
    case 'geography':
      ledgerColorMap = getLedgerColorMap(
        GEOGRAPHY_LEDGER_NAMES,
        GEOGRAPHY_COLOURS
      );
      break;
    case 'governance':
      ledgerColorMap = getLedgerColorMap(
        GOVERNANCE_LEDGER_NAMES,
        GOVERNANCE_COLOURS
      );
      break;
    default:
      ledgerColorMap = {};
  }

  return {
    labels: buildLabels(data, minValue, maxValue),
    datasets: buildDatasets(data, metric, ledgerColorMap),
  };
}

function getLedgerColorMap(ledgerNames: string[], colours: string[]) {
  return ledgerNames.reduce((acc, ledger, index) => {
    acc[ledger] = colours[index % colours.length];
    return acc;
  }, {} as Record<string, string>);
}

function buildLabels(data: DataEntry[], minValue: number, maxValue: number) {
  const filteredData = data.filter((entry) => {
    const date = entry.date.getTime();
    return date >= minValue && date <= maxValue;
  });
  const sortedData = filteredData.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  return sortedData.map((entry) => entry.date);
}

function buildDatasets(
  data: DataEntry[],
  metric: string,
  ledgerColorMap: { [key: string]: string }
) {
  // Initialize ledger datasets for the current metric
  const ledgerDatasets = {} as LedgerDatasets;

  // Iterate through data entries
  data.forEach((entry) => {
    const ledger = entry.ledger;
    const rawValue = entry[metric];

    if (!ledger || typeof rawValue !== 'number' || isNaN(rawValue)) return;
    // Ensure ledger dataset for the current metric is initialized
    if (!ledgerDatasets[ledger]) {
      ledgerDatasets[ledger] = {
        label: ledger,
        data: [],
        borderColor: ledgerColorMap[ledger],
        backgroundColor: ledgerColorMap[ledger],
        fill: false,
        pointRadius: 1.5,
        pointHoverRadius: 3,
      };
    }

    // Push data point (x: snapshot_date, y: metric value) to the ledger dataset
    ledgerDatasets[ledger].data.push({
      x: entry.date,
      y: rawValue as number,
    });
  });

  // Extract datasets for the current metric
  return Object.values(ledgerDatasets);
}

export function findMinMaxValues(data: DataEntry[]) {
  const dates = data.map((entry) => entry.date.getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  return {
    minValue: minDate.getTime(),
    maxValue: maxDate.getTime(),
  };
}

// Define the plugin with theme support
export function createWatermarkPlugin(theme?: string): Plugin<'doughnut'> {
  // Determine the image source based on the theme
  const imageSrc =
    theme === 'dim' ? LINECHART_WATERMARK_WHITE : LINECHART_WATERMARK_BLACK;

  const fontColor = theme === 'dim' ? 'white' : 'black';

  return {
    id: 'customCanvasBackgroundImage',
    beforeDraw: (chart) => {
      // Check if `Image` is defined (only available in browser)
      if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
        const { ctx, chartArea } = chart;
        // Ensure context and chartArea are available
        if (!ctx || !chartArea) return;

        const image = new Image();
        image.src = imageSrc;

        //const currentDate = new Date().toLocaleDateString()
        /*
        const currentDate = new Intl.DateTimeFormat("en-GB", {
          month: "short", //long
          day: "numeric",
          year: "numeric"
        }).format(new Date())
        */
        const currentDate = new Date().toISOString().split('T')[0];

        if (image.complete) {
          // Image is loaded, draw it on the chart
          /*
          const { top, left } = chartArea
          const x = left
          const y = top

          // Set watermark opacity
          ctx.save() // Save the current canvas state
          ctx.globalAlpha = 0.2 // Set the opacity
          ctx.drawImage(image, x, y) // Draw the image
          ctx.restore() // Restore the canvas state to clear the opacity setting
          */
          drawWatermark(ctx, chartArea, image, currentDate, fontColor);
        } else {
          // Image is not loaded, wait for it
          image.onload = () => {
            //chart.draw() // Redraw the chart after the image is loaded
            if (chart && chart.ctx && chartArea) {
              drawWatermark(
                chart.ctx,
                chart.chartArea,
                image,
                currentDate,
                fontColor
              );

              chart.draw(); // Redraw the chart after watermark is applied
            }
          };

          image.onerror = () => {
            console.error('Failed to load watermark image.');
          };
        }
      } else {
        console.warn('Image object is not available.');
      }
    },
  };
}

// Helper function to draw the watermark
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  chartArea: { top: number; left: number; width: number; height: number },
  image: HTMLImageElement,
  date: string,
  fontColor: string
) {
  const { top, left } = chartArea;
  const x_image = left + 10;
  const y_image = top + 10;

  const x_date = x_image + 80; //left + 200;
  const y_date = y_image + 80;

  const watermarkWidth = 120; // Adjust this to make it smaller/larger
  const watermarkHeight = 60;

  ctx.save(); // Save the current canvas state
  ctx.globalAlpha = 0.3; // the opacity
  //ctx.drawImage(image, x_image, y_image); // Draw the image
  ctx.drawImage(image, x_image, y_image, watermarkWidth, watermarkHeight);

  ctx.font = '12px Courier New'; // font size and style
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fontColor; // text color
  ctx.fillText(date, x_date, y_date);
  ctx.restore(); // Restore the canvas state
}

// Function to generate additional unique colors if needed
function generateUniqueColor(existingColors: string[]): string {
  // Simple function to generate random RGB color
  let newColor;
  do {
    // Ensure bright colors by keeping RGB values higher
    const r = Math.floor(Math.random() * 128) + 128; // Range: 128-255
    const g = Math.floor(Math.random() * 128) + 128; // Range: 128-255
    const b = Math.floor(Math.random() * 128) + 128; // Range: 128-255
    newColor = `rgba(${r}, ${g}, ${b}, 1)`;
  } while (existingColors.includes(newColor)); // Ensure no duplicates
  return newColor;
}

export function getColorsForChart(length: number): string[] {
  const colors = [...SOFTWARE_COLOURS];

  // If the number of data points exceeds the predefined colors, generate new ones
  if (length > SOFTWARE_COLOURS.length) {
    for (let i = SOFTWARE_COLOURS.length; i < length; i++) {
      const newColor = generateUniqueColor(colors);
      colors.push(newColor); // Add unique color
    }
  }

  return colors.slice(0, length); // Ensure the correct number of colors
}
