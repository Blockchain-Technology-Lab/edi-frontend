import { useRef, useState, useContext, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scale, Coins, Network, Code, Globe } from "lucide-react";

import { ImageDown, Palette } from 'lucide-react';
import { ThemeContext } from "@/contexts";
import { useExportChart } from "@/hooks";
import type { RadarDataPoint } from '@/hooks/useRadarCsv';
import {
    transformRadarData,
    getRadarChartOptions,
    PROTOCOL_COLORS,
    LINECHART_WATERMARK_WHITE,
    LINECHART_WATERMARK_BLACK
} from '@/utils';
import { useNavigate } from "@tanstack/react-router";

import { consensusRoute, tokenomicsRoute, networkRoute, softwareRoute, geographyRoute } from "@/router";

// Register Chart.js components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);



interface RadarChartProps {
    data: RadarDataPoint[];
    title?: string;
    description?: string;
    height?: number;
    showExport?: boolean;
    showLegendToggle?: boolean;
    className?: string;
}

export function RadarChart({
    data,
    title = 'Protocol Decentralisation Comparison',
    description = '',
    height = 500,
    showExport = true,
    showLegendToggle = false,
    className = '',
}: RadarChartProps) {
    const { theme: resolvedTheme } = useContext(ThemeContext);
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const exportChart = useExportChart();
    const [visibleDatasets, setVisibleDatasets] = useState<Set<number>>(
        new Set(Array.from({ length: data.length }, (_, i) => i))
    );
    // Add state for managing accordion
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);

    const chartData = transformRadarData(data);

    // Filter datasets based on visibility
    const filteredChartData = {
        ...chartData,
        datasets: chartData.datasets.filter((_, index) => visibleDatasets.has(index)),
    };

    const options = useMemo(() => {
        if (resolvedTheme) {
            return getRadarChartOptions(resolvedTheme === 'dim' ? 'dark' : 'light');
        }
    }, [resolvedTheme]);

    const handleDatasetToggle = (index: number) => {
        const newVisibleDatasets = new Set(visibleDatasets);
        if (newVisibleDatasets.has(index)) {
            newVisibleDatasets.delete(index);
        } else {
            newVisibleDatasets.add(index);
        }
        setVisibleDatasets(newVisibleDatasets);
    };

    const handleExport = () => {
        exportChart(chartRef, title.toLowerCase().replace(/\s+/g, '-'));
    };

    const watermarkSrc = resolvedTheme === 'dim'
        ? LINECHART_WATERMARK_WHITE
        : LINECHART_WATERMARK_BLACK;

    if (!data || data.length === 0) {
        return <RadarChartSkeleton className={className} />;
    }

    if (!options) return null;
    const navigate = useNavigate();


    const EDI_LAYERS = [
        {
            name: 'Consensus',
            description: <>Measures the decentralisation of consensus participants (block producers). The metric used in the Decentralisation Compass is the Herfindahl-Hirschman Index (HHI), inverted and scaled. For broader comparisons across systems, metrics, and timeframes, see <span className="text-blue-500 underline cursor-pointer" onClick={() => navigate({ to: consensusRoute.to })}>Consensus</span>.</>,
            details: [
                'Validator/miner distribution',
                'Voting power concentration',
                'Consensus participation rates',
                'Block production diversity'
            ],
            color: '#3B82F6',
            icon: Scale
        },
        {
            name: 'Tokenomics',
            description: <>Measures the decentralisation of native asset (token) ownership.  The metric used in the Decentralisation Compass is the 3-concentration ratio, inverted and scaled. For broader comparisons across systems, metrics, and timeframes, see <span className="text-blue-500 underline cursor-pointer" onClick={() => navigate({ to: tokenomicsRoute.to })}>Tokenomics</span>.</>,
            details: [
                'Token distribution fairness',
                'Wealth concentration metrics',
                'Economic incentive alignment',
                'Staking participation'
            ],
            color: '#10B981',
            icon: Coins
        },
        {
            name: 'Software',
            description: <>Measures the decentralisation of contributors to full node software implementations. The metric used in the Decentralisation Compass is the 1-concentration ratio, inverted and scaled. For broader comparisons across systems, metrics, and timeframes, see <span className="text-blue-500 underline cursor-pointer" onClick={() => navigate({ to: softwareRoute.to })}>Software</span>.</>,
            details: [
                'Developer contribution diversity',
                'Code repository distribution',
                'Implementation varieties',
                'Development governance'
            ],
            color: '#F59E0B',
            icon: Code
        },
        {
            name: 'Network',
            description: <>Measures the decentralisation of organisations operating a network's full nodes. Note that for the case of Ethereum, this specifically refers to Execution Layer nodes. The metric used in the Decentralisation Compass is the Herfindahl-Hirschman Index (HHI), inverted and scaled. For broader comparisons across systems, metrics, and timeframes, see <span className="text-blue-500 underline cursor-pointer" onClick={() => navigate({ to: networkRoute.to })}>Network</span>.</>,
            details: [
                'Node geographical spread',
                'Infrastructure diversity',
                'Network resilience',
                'Operational independence'
            ],
            color: '#EF4444',
            icon: Network
        },
        {
            name: 'Geography',
            description: <>Measures the decentralisation of countries where full nodes are located. Note that for the case of Ethereum, this specifically refers to Execution Layer nodes. The metric shown in the Decentralisation Compass is the Herfindahl-Hirschman Index (HHI), inverted and scaled. For broader comparisons across systems, metrics, and timeframes, see <span className="text-blue-500 underline cursor-pointer" onClick={() => navigate({ to: geographyRoute.to })}>Geography</span>.</>,
            details: [
                'Global participant spread',
                'Regional concentration risks',
                'Regulatory jurisdiction diversity',
                'Physical infrastructure distribution'
            ],
            color: '#8B5CF6',
            icon: Globe
        }
    ];

    return (
        <div className={`card bg-base-200 shadow-lg ${className}`}>
            <div className="card-body p-6">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <h3 className="card-title text-xl font-bold">{title}</h3>

                        <div className="flex items-center gap-2">
                            {/* Legend Toggle */}
                            {showLegendToggle && (
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-sm btn-ghost"
                                        aria-label="Toggle protocols"
                                    >
                                        <Palette size={16} />
                                    </div>
                                    <div className="dropdown-content z-10 card card-compact w-64 p-4 shadow bg-base-100 border border-base-300">
                                        <div className="space-y-2">
                                            <p className="font-semibold text-sm mb-3">Toggle Protocols:</p>
                                            {data.map((protocol, index) => {
                                                const colors = PROTOCOL_COLORS[protocol.protocol.toLowerCase() as keyof typeof PROTOCOL_COLORS];
                                                return (
                                                    <label key={protocol.protocol} className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-sm"
                                                            checked={visibleDatasets.has(index)}
                                                            onChange={() => handleDatasetToggle(index)}
                                                        />
                                                        <div
                                                            className="w-4 h-4 rounded-full border-2"
                                                            style={{
                                                                backgroundColor: colors?.background || 'rgba(128, 128, 128, 0.2)',
                                                                borderColor: colors?.border || 'rgba(128, 128, 128, 1)',
                                                            }}
                                                        />
                                                        <span className="text-sm capitalize">{protocol.protocol}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Export Button */}
                            {showExport && (
                                <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={handleExport}
                                    aria-label="Download chart as PNG"
                                    title="Download as PNG"
                                >
                                    <ImageDown size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description directly under title */}
                    {description && (
                        <p className="text-base-content/70 text-sm mt-2">{description}</p>
                    )}
                </div>

                {/* Chart Container - Split Layout */}
                <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: `${height}px` }}>
                    {/* Left Side - Chart (2/3 width) */}
                    <div className="w-full lg:w-2/3 relative" style={{ height: `${height}px` }}>
                        <Radar
                            data={filteredChartData}
                            options={options}
                            ref={(ref) => {
                                if (ref) {
                                    chartRef.current = ref.canvas;
                                }
                            }}
                        />

                        {/* Watermark Image - Ultra Responsive */}
                        <img
                            src={watermarkSrc}
                            alt="Edinburgh Decentralisation Index"
                            className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6 opacity-10 pointer-events-none select-none z-10"
                            style={{
                                width: 'clamp(60px, 8vw, 120px)',
                                height: 'clamp(60px, 8vw, 120px)',
                                objectFit: 'contain',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Right Side - Information Panel (1/3 width) */}
                    <div className="w-full lg:w-1/3 bg-base-200 rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-4">Description per layer</h4>

                        {/* EDI Layers Information Accordion */}
                        <div className="space-y-2">
                            {EDI_LAYERS.map((layer, index) => (
                                <div key={layer.name} className="collapse collapse-arrow bg-base-300 border border-base-300">
                                    <input
                                        type="checkbox"
                                        checked={openAccordion === index}
                                        onChange={() => setOpenAccordion(openAccordion === index ? null : index)}
                                    />
                                    <div
                                        className="collapse-title font-semibold cursor-pointer"
                                        onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* 🔧 Replace colored dot with icon */}
                                            <layer.icon
                                                size={16}
                                                style={{ color: layer.color }}
                                                className="flex-shrink-0"
                                            />
                                            <span>{layer.name}</span>
                                        </div>
                                    </div>
                                    <div className={`collapse-content text-sm ${openAccordion === index ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
                                        <div className="pt-2">
                                            <p className="text-base-content/80 leading-relaxed">
                                                {layer.description}
                                            </p>

                                            {/* Show current protocol scores for this dimension */}
                                            {/*
                                            <div className="mt-3 space-y-2">
                                                <div className="text-xs font-medium text-base-content/70 mb-2">
                                                    Protocols:
                                                </div>
                                                {data.filter((_, protocolIndex) => visibleDatasets.has(protocolIndex)).map((protocol) => {
                                                    const value = protocol[layer.name.toLowerCase() as keyof RadarDataPoint] as number;
                                                    const protocolColors = PROTOCOL_COLORS[protocol.protocol.toLowerCase() as keyof typeof PROTOCOL_COLORS];

                                                    return (
                                                        <div key={protocol.protocol} className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-2 h-2 rounded-full"
                                                                    style={{ backgroundColor: protocolColors?.border || 'rgba(128, 128, 128, 1)' }}
                                                                />
                                                                <span className="capitalize">{protocol.protocol}</span>
                                                            </div>
                                                            <span className="font-mono font-medium">
                                                                {value === 0 ||
                                                                    value == null ||
                                                                    value === undefined ||
                                                                    isNaN(value)
                                                                    ? 'N/A'
                                                                    : `${value.toFixed(1)}`}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function RadarChartSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`card bg-base-300 shadow-lg p-6 ${className}`}>
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg mb-4"></div>
                    <p className="text-base-content/60">Loading radar chart data...</p>
                </div>
            </div>
        </div>
    );
}