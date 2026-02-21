import React from "react";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { useSimStore } from "../../store/useSimStore";
import { SKILL_CATEGORIES } from "../../data/categories";

export function PoolHealthChart() {
    const pool = useSimStore((state) => state.pool);
    const history = useSimStore((state) => state.poolHistory);

    // Prepare data for the Bar Chart: Capacity by Category
    const barData = Object.entries(pool.byCategory || {}).map(([cat, cap]) => ({
        category: SKILL_CATEGORIES[cat]?.label || cat,
        capacity: cap,
        id: cat
    })).sort((a, b) => b.capacity - a.capacity).slice(0, 8);

    const currentHealth = pool.healthScore || 0;
    let healthColor = "#ef4444"; // red
    if (currentHealth > 0.8) healthColor = "#10b981"; // green
    else if (currentHealth >= 0.5) healthColor = "#f59e0b"; // amber

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-100 italic">Pool Capacity & Health</h2>
                    <p className="text-xs text-slate-500">Resource backing by category vs overall health</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Health Score</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: healthColor }}>
                        {(currentHealth * 100).toFixed(0)}%
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[300px] flex flex-col gap-4">
                {/* Capacity Bars */}
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis
                                type="category"
                                dataKey="category"
                                stroke="#94a3b8"
                                fontSize={10}
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: '#1e293b' }}
                                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                            />
                            <Bar dataKey="capacity" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={12} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Health Line (History) */}
                <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={history}>
                            <XAxis dataKey="tick" hide />
                            <YAxis domain={[0, 1]} hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                                itemStyle={{ color: healthColor, fontSize: "10px" }}
                                labelFormatter={(l) => `Tick ${l}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="healthScore"
                                stroke={healthColor}
                                strokeWidth={2}
                                dot={false}
                                animationDuration={300}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
