import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { RadarDataPoint } from '@/hooks/useRadarCsv';
import type { ChartOptions } from 'chart.js';

// Register Chart.js components for radar charts
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Protocol colors for consistent styling
export const PROTOCOL_COLORS = {
  bitcoin: {
    background: 'rgba(255, 193, 7, 0.2)', // 🔧 Bright Amber/Gold
    border: 'rgba(255, 193, 7, 1)',
    point: 'rgba(255, 193, 7, 1)',
  },
  ethereum: {
    background: 'rgba(40, 167, 69, 0.2)', // 🔧 Bright Green
    border: 'rgba(40, 167, 69, 1)',
    point: 'rgba(40, 167, 69, 1)',
  },
  cardano: {
    background: 'rgba(59, 130, 246, 0.2)', // 🔧 #3B82F6 Blue
    border: 'rgba(59, 130, 246, 1)',
    point: 'rgba(59, 130, 246, 1)',
  },
  litecoin: {
    background: 'rgba(253, 126, 20, 0.2)', // 🔧 Bright Orange
    border: 'rgba(253, 126, 20, 1)',
    point: 'rgba(253, 126, 20, 1)',
  },
} as const;

// Default colors for unknown protocols
const DEFAULT_COLORS = [
  {
    background: 'rgba(255, 99, 132, 0.2)',
    border: 'rgba(255, 99, 132, 1)',
    point: 'rgba(255, 99, 132, 1)',
  },
  {
    background: 'rgba(54, 162, 235, 0.2)',
    border: 'rgba(54, 162, 235, 1)',
    point: 'rgba(54, 162, 235, 1)',
  },
  {
    background: 'rgba(255, 205, 86, 0.2)',
    border: 'rgba(255, 205, 86, 1)',
    point: 'rgba(255, 205, 86, 1)',
  },
  {
    background: 'rgba(75, 192, 192, 0.2)',
    border: 'rgba(75, 192, 192, 1)',
    point: 'rgba(75, 192, 192, 1)',
  },
];

export function getProtocolColor(protocol: string, index: number) {
  const normalizedProtocol = protocol.toLowerCase();
  return (
    PROTOCOL_COLORS[normalizedProtocol as keyof typeof PROTOCOL_COLORS] ||
    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  );
}

export function transformRadarData(data: RadarDataPoint[]) {
  const labels = [
    'Consensus',
    'Tokenomics',
    'Software',
    'Network',
    'Geography',
  ];

  const datasets = data.map((protocol, index) => {
    const colors = getProtocolColor(protocol.protocol, index);

    return {
      label:
        protocol.protocol.charAt(0).toUpperCase() + protocol.protocol.slice(1),
      data: [
        protocol.consensus,
        protocol.tokenomics,
        protocol.software,
        protocol.network,
        protocol.geography,
      ],
      backgroundColor: colors.background,
      borderColor: colors.border,
      pointBackgroundColor: colors.point,
      pointBorderColor: colors.border,
      pointBorderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
      borderWidth: 2,
      fill: true,
    };
  });

  return { labels, datasets };
}

const horizontalLabelsPlugin = {
  id: 'horizontalLabels',
  afterDraw: (chart: any) => {
    const { ctx, scales } = chart;
    const scale = scales.r;
    const labels = scale.pointLabels;
    const labelCount = labels.length;

    const centerX = scale.xCenter;
    const centerY = scale.yCenter;
    const radius = scale.drawingArea + 20;

    ctx.save();
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = scale.options.pointLabels.color;

    labels.forEach((label: string, i: number) => {
      const angle = (i / labelCount) * (2 * Math.PI) - Math.PI / 2;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Always draw text horizontal (not rotated)
      ctx.fillText(label, x, y);
    });

    ctx.restore();
  },
};

export function getRadarChartOptions(
  theme: 'light' | 'dark' = 'light'
): ChartOptions<'radar'> {
  const textColor = theme === 'dark' ? '#ffffff' : '#374151';

  const customAxisPlugin = {
    id: 'customAxisLabels',
    afterDraw: (chart: any) => {
      const ctx = chart.ctx;
      const centerX =
        chart.chartArea.left +
        (chart.chartArea.right - chart.chartArea.left) / 2;
      const centerY =
        chart.chartArea.top +
        (chart.chartArea.bottom - chart.chartArea.top) / 2;
      const radius = Math.min(
        chart.chartArea.right - centerX,
        chart.chartArea.bottom - centerY
      );

      ctx.save();
      ctx.resetTransform();

      // Draw horizontal axis line at bottom -
      ctx.strokeStyle = '#D3D3D3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY + radius - 20);
      ctx.lineTo(centerX + radius, centerY + radius - 20);
      ctx.stroke();

      // Draw percentage labels with guaranteed horizontal orientation
      ctx.fillStyle = textColor;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let i = 0; i <= 100; i += 20) {
        const x = centerX - radius + (radius * 2 * i) / 100;
        const y = centerY + radius - 15;
        ctx.fillText(i, x, y);
      }

      ctx.restore();
    },
  };

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: 300 as const,
          },
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor:
          theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: '#808080',
        borderWidth: 0,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.raw as number;

            if (
              value === 0 ||
              value == null ||
              value === undefined ||
              isNaN(value)
            ) {
              return `${label}: N/A`;
            }

            return `${label}: ${value.toFixed(1)}`;
          },
        },
      },
      horizontalLabels: horizontalLabelsPlugin,
      customAxisLabels: customAxisPlugin,
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        startAngle: 0,
        ticks: {
          stepSize: 20,
          display: true,
          showLabelBackdrop: false,
          color: textColor,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          backdropColor: 'rgba(255, 255, 255, 0.9)',
          backdropPadding: 4,
          callback: function (value: any) {
            return value;
          },
          z: 10,
        },
        grid: {
          color: '#D3D3D3',
          circular: true,
        },
        angleLines: {
          color: '#A9A9A9',
        },
        pointLabels: {
          color: textColor,
          font: {
            size: 12,
            weight: 600 as const,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  } as ChartOptions<'radar'>;
}

// Export chart data for screenshots
export function exportRadarChart(
  chartRef: React.RefObject<ChartJS>,
  filename: string = 'radar-chart'
) {
  if (!chartRef.current) return;

  const canvas = chartRef.current.canvas;
  const url = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = url;
  link.click();
}
