import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { useSimStore } from "../../store/useSimStore";

const CAT_COLORS = {
    software_dev: "#3b82f6",
    design_creative: "#ec4899",
    writing_content: "#f59e0b",
    cooking_food: "#10b981",
    handyman_repair: "#a855f7"
};

const CAT_LABELS = {
    software_dev: "Software",
    design_creative: "Design",
    writing_content: "Writing",
    cooking_food: "Food",
    handyman_repair: "Handyman"
};

export function CirculationChart() {
    const history = useSimStore((state) => state.circulationHistory);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-100 italic">Token Circulation</h2>
                <p className="text-xs text-slate-500">Volume exchanged per day by core category</p>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="tick"
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `D${val}`}
                        />
                        <YAxis
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                            labelStyle={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}
                            itemStyle={{ fontSize: "12px" }}
                        />
                        <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        {Object.keys(CAT_COLORS).map((cat) => (
                            <Area
                                key={cat}
                                type="monotone"
                                dataKey={cat}
                                name={CAT_LABELS[cat]}
                                stackId="1"
                                stroke={CAT_COLORS[cat]}
                                fill={CAT_COLORS[cat]}
                                fillOpacity={0.6}
                                animationDuration={300}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
