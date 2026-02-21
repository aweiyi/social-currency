import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceArea
} from "recharts";
import { useSimStore } from "../../store/useSimStore";

export function GiniChart() {
    const history = useSimStore((state) => state.giniHistory);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-100 italic">Inequality (Gini)</h2>
                <p className="text-xs text-slate-500">Wealth distribution over time (0 = equal, 1 = unequal)</p>
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
                            domain={[0, 1]}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                            itemStyle={{ color: "#f59e0b", fontSize: "12px", fontWeight: "bold" }}
                            labelStyle={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}
                        />

                        {/* Shaded Zones */}
                        <ReferenceArea y1={0} y2={0.3} fill="#064e3b" fillOpacity={0.1} />
                        <ReferenceArea y1={0.3} y2={0.6} fill="#78350f" fillOpacity={0.1} />
                        <ReferenceArea y1={0.6} y2={1.0} fill="#7f1d1d" fillOpacity={0.1} />

                        <ReferenceLine y={0.3} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} />
                        <ReferenceLine y={0.6} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />

                        <Line
                            type="monotone"
                            dataKey="tokenGini"
                            name="Token Gini"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 4 }}
                            animationDuration={300}
                        />
                        <Line
                            type="monotone"
                            dataKey="fiatGini"
                            name="Fiat Gini"
                            stroke="#64748b"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            dot={false}
                            animationDuration={300}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
