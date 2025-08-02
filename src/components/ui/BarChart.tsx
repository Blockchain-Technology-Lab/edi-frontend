import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext, useEffect } from 'react';
import { ThemeContext } from "@/contexts";
import { LINECHART_WATERMARK_WHITE, LINECHART_WATERMARK_BLACK } from "@/utils";
import { LEDGER_DISPLAY_NAME_MAP, type NetworkBarEntry } from "@/utils";
import Tippy from "@tippyjs/react";
import { Info } from "lucide-react";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LEDGER_COLOR_MAP: Record<string, string> = {
  bitcoin: "#f7931a", // Bitcoin orange
  bitcoin_cash: "#8dc351", // Bitcoin Cash green
  dogecoin: "#c2a633", // Dogecoin gold
  litecoin: "#345c9c", // Litecoin blue
  zcash: "#ecb244", // Zcash yellow
  consensus: "#808080", // Ethereum gray,
  execution: "#b0b0b0", // Ethereum gray
  cardano: "#0033ad", // Cardano blue
};

const DEFAULT_COLOR = "#2563eb"; // fallback blue

interface BarChartProps {
  title: string;
  data: NetworkBarEntry[];
  loading?: boolean;
  description?: string;
}

export function BarChart({ data, loading, title, description }: BarChartProps) {
  const { theme: resolvedTheme } = useContext(ThemeContext);

  // a chart-specific watermark plugin that positions on the right
  useEffect(() => {
    const rightWatermarkPlugin = {
      id: 'barChartRightWatermark',
      beforeDraw: (chart: any) => {
        const ctx = chart.ctx;
        const canvas = chart.canvas;

        // Create and load the watermark image
        const img = new Image();
        img.src = resolvedTheme === 'dim' ? LINECHART_WATERMARK_WHITE : LINECHART_WATERMARK_BLACK;

        // Use cached image if already loaded, otherwise load it
        if (img.complete) {
          drawRightWatermark(ctx, canvas, img);
        } else {
          img.onload = () => {
            chart.draw(); // Redraw chart when image loads
          };
        }
      }
    };

    const drawRightWatermark = (ctx: any, canvas: any, img: any) => {
      //  Add null check for canvas
      if (!canvas) {
        console.warn('Canvas is null, skipping watermark draw');
        return;
      }

      //  Add additional checks
      if (!ctx || !canvas.width || !canvas.height) {
        console.warn('Canvas or context not ready, skipping watermark draw');
        return;
      }

      // safely access canvas.width and canvas.height
      const maxWidth = 100;
      const maxHeight = 100;

      // scale to maintain aspect ratio
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Position on the right side
      const x = canvas.width - scaledWidth - 20; // 20px margin from right
      const y = 10; // Position at top with 20px margin

      ctx.save();
      ctx.globalAlpha = 0.1; // Low opacity
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      ctx.restore();
    };

    // Register the plugin with higher priority to override existing watermark
    Chart.register(rightWatermarkPlugin);

    return () => {
      Chart.unregister(rightWatermarkPlugin);
    };
  }, [resolvedTheme]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!data || data.length === 0)
    return <div className="text-center py-8">No data</div>;

  const chartData = {
    labels: data.map((d) => LEDGER_DISPLAY_NAME_MAP[d.ledger] || d.ledger),
    datasets: [
      {
        label: "Nodes",
        data: data.map((d) => d.nodes),
        backgroundColor: data.map(
          (d) => LEDGER_COLOR_MAP[d.ledger] || DEFAULT_COLOR
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: title ? { display: true, text: title } : undefined,
      // Disable the global watermark plugin for this chart
      customCanvasBackgroundImage: false,
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <>
      <div className="card-body">
        <div className="flex justify-between items-center shadow-lg text-2xl card-title bg-base-300 alert w-full mb-1">
          {title}
          <Tippy content={description} placement="bottom">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-circle btn-ghost text-base-content hover:text-accent"
              aria-label={`Info about ${title}`}
            >
              <Info />
            </button>
          </Tippy>
        </div>
        <div className="card bg-base-300 shadow-lg p-4 space-y-4">
          <div className="">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}
