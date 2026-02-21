import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { useSimStore } from "../../store/useSimStore";

const COLORS = ["#f59e0b", "#14b8a6", "#3b82f6", "#a855f7", "#ec4899"];

export function PriceChart() {
    const history = useSimStore((state) => state.priceHistory);
    const agents = useSimStore((state) => state.agents);

    // Get names for Legend/Tooltip from the first history entry or agents list
    const topAgentIds = history.length > 0 ? Object.keys(history[0]).filter(k => k !== 'tick') : [];

    const getAgentName = (id) => {
        const agent = agents.find(a => a.id === id);
        return agent ? agent.name : id;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-100 italic">Market Prices</h2>
                <p className="text-xs text-slate-500">Price history for top specialized agents</p>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                            domain={[0, 1.2]}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                            labelStyle={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}
                            itemStyle={{ fontSize: "12px" }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        {topAgentIds.map((id, index) => (
                            <Line
                                key={id}
                                type="monotone"
                                dataKey={id}
                                name={getAgentName(id)}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                                animationDuration={300}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
