import React from "react";
import { useSimStore } from "../../store/useSimStore";
import { SKILL_CATEGORIES } from "../../data/categories";

export function CategoryHeatmap() {
    const categoryStats = useSimStore((state) => state.categoryStats);

    const categories = Object.keys(SKILL_CATEGORIES);

    const maxVolume = Math.max(
        ...Object.values(categoryStats).flatMap((s) => [s.token, s.fiat]),
        1
    );

    const getIntensity = (val) => {
        const ratio = Math.min(val / (maxVolume * 0.5), 1);
        return ratio;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-4 text-center">
                <h2 className="text-lg font-bold text-slate-100 italic text-left">Category Activity Heatmap</h2>
                <p className="text-xs text-slate-500 text-left">Cumulative exchange volume by category and method</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className="grid grid-cols-[1fr_80px_80px] gap-2 mb-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Category</div>
                    <div className="text-[10px] text-amber-500 uppercase font-bold tracking-wider text-center">Token</div>
                    <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider text-center">Fiat</div>
                </div>

                <div className="space-y-1">
                    {categories.map((cat) => {
                        const stats = categoryStats[cat] || { token: 0, fiat: 0 };
                        const tokenIntensity = getIntensity(stats.token);
                        const fiatIntensity = getIntensity(stats.fiat);

                        return (
                            <div key={cat} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center group">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{SKILL_CATEGORIES[cat].emoji}</span>
                                    <span className="text-xs text-slate-400 group-hover:text-slate-200 truncate font-medium">
                                        {SKILL_CATEGORIES[cat].label}
                                    </span>
                                </div>

                                {/* Token Cell */}
                                <div
                                    className="h-8 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all border border-amber-500/10"
                                    style={{
                                        backgroundColor: `rgba(245, 158, 11, ${tokenIntensity * 0.4})`,
                                        color: tokenIntensity > 0.3 ? "#fef3c7" : "#78350f"
                                    }}
                                >
                                    {stats.token > 0 ? stats.token.toFixed(1) : ""}
                                </div>

                                {/* Fiat Cell */}
                                <div
                                    className="h-8 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all border border-emerald-500/10"
                                    style={{
                                        backgroundColor: `rgba(16, 185, 129, ${fiatIntensity * 0.4})`,
                                        color: fiatIntensity > 0.3 ? "#ecfdf5" : "#064e3b"
                                    }}
                                >
                                    {stats.fiat > 0 ? stats.fiat.toFixed(1) : ""}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
