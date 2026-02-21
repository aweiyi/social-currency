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

export function DualCurrencyChart() {
    const history = useSimStore((state) => state.dualCurrencyHistory);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-100 italic">Token vs Fiat Usage</h2>
                <p className="text-xs text-slate-500">Volume of exchanges by payment method over time</p>
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
                        <Area
                            type="monotone"
                            dataKey="token"
                            name="Social Token"
                            stackId="1"
                            stroke="#f59e0b"
                            fill="#f59e0b"
                            fillOpacity={0.6}
                            animationDuration={300}
                        />
                        <Area
                            type="monotone"
                            dataKey="fiat"
                            name="Fiat Currency"
                            stackId="1"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.6}
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
