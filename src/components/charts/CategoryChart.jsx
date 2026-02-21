import React, { useMemo } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";
import { useSimStore } from "../../store/useSimStore";
import { SKILL_CATEGORIES } from "../../data/categories";

export function CategoryChart() {
    const agents = useSimStore((state) => state.agents);

    const data = useMemo(() => {
        const categories = Object.keys(SKILL_CATEGORIES);
        return categories.map((cat) => {
            let supply = 0;
            let demand = 0;
            agents.forEach((a) => {
                supply += a.skills[cat] || 0;
                demand += a.needs_tendency[cat] || 0;
            });
            return {
                subject: SKILL_CATEGORIES[cat].label,
                supply: supply,
                demand: demand,
                fullMark: 150,
            };
        }).sort((a, b) => (b.supply + b.demand) - (a.supply + a.demand)).slice(0, 8); // Top 8 for readability
    }, [agents]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-100 italic">Supply vs Demand</h2>
                <p className="text-xs text-slate-500">Community capacity vs necessity per category</p>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#1e293b" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar
                            name="Supply"
                            dataKey="supply"
                            stroke="#14b8a6"
                            fill="#14b8a6"
                            fillOpacity={0.5}
                        />
                        <Radar
                            name="Demand"
                            dataKey="demand"
                            stroke="#f59e0b"
                            fill="#f59e0b"
                            fillOpacity={0.5}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                            itemStyle={{ fontSize: "12px" }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
