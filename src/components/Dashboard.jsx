import React, { useState } from "react";
import { TrendingUp, BarChart2, Activity, ShieldCheck, PieChart, Grid, Layers, Share2 } from "lucide-react";

import { SocialPremiumChart } from "./charts/SocialPremiumChart";
import { PriceChart } from "./charts/PriceChart";
import { CirculationChart } from "./charts/CirculationChart";
import { PoolHealthChart } from "./charts/PoolHealthChart";
import { GiniChart } from "./charts/GiniChart";
import { CategoryChart } from "./charts/CategoryChart";
import { DualCurrencyChart } from "./charts/DualCurrencyChart";
import { CategoryHeatmap } from "./charts/CategoryHeatmap";

const CHARTS = [
    { id: "premium", label: "Social Premium", icon: TrendingUp },
    { id: "price", label: "Agent Prices", icon: Share2 },
    { id: "circulation", label: "Circulation", icon: Activity },
    { id: "pool", label: "Pool Health", icon: ShieldCheck },
    { id: "gini", label: "Gini Index", icon: BarChart2 },
    { id: "category", label: "Radar", icon: PieChart },
    { id: "dual", label: "Dual Economy", icon: Layers },
    { id: "heatmap", label: "Heatmap", icon: Grid },
];

export function Dashboard() {
    const [activeChart, setActiveChart] = useState("premium");

    const renderChart = () => {
        switch (activeChart) {
            case "premium": return <SocialPremiumChart />;
            case "price": return <PriceChart />;
            case "circulation": return <CirculationChart />;
            case "pool": return <PoolHealthChart />;
            case "gini": return <GiniChart />;
            case "category": return <CategoryChart />;
            case "dual": return <DualCurrencyChart />;
            case "heatmap": return <CategoryHeatmap />;
            default: return <SocialPremiumChart />;
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-navy-surface border border-navy-border rounded-lg overflow-hidden h-full">
            {/* Chart Selector Sidebar/Header */}
            <div className="flex items-center gap-1 p-2 bg-navy-base/30 border-b border-navy-border overflow-x-auto custom-scrollbar no-scrollbar">
                {CHARTS.map((chart) => {
                    const Icon = chart.icon;
                    const isActive = activeChart === chart.id;
                    return (
                        <button
                            key={chart.id}
                            onClick={() => setActiveChart(chart.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${isActive
                                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent"
                                }`}
                        >
                            <Icon size={14} />
                            {chart.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Chart Area */}
            <div className="flex-1 p-6 relative h-full">
                {/* Bloomberg-style aesthetic borders/accents */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-right border-slate-800 pointer-events-none opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-slate-800 pointer-events-none opacity-50"></div>

                {renderChart()}
            </div>
        </div>
    );
}
