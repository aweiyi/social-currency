import React from "react";
import { useSimStore, selectDualCurrencyMetrics } from "../store/useSimStore";
import { Activity, ShieldCheck, Users, BarChart2, Coins } from "lucide-react";

export function StatCards() {
    const pool = useSimStore(state => state.pool);
    const agents = useSimStore(state => state.agents);
    const tokens = useSimStore(state => state.tokens);
    const transactions = useSimStore(state => state.transactions);
    const history = useSimStore(state => state.giniHistory);

    const last = history[history.length - 1];
    const latestGini = last ? last.tokenGini : 0;

    const activeAgents = agents.filter(a => a.isActive).length;

    // Active tokens in circulation
    const tokenCirculation = tokens
        .filter(t => t.status === "active")
        .reduce((sum, t) => sum + (t.amount ?? 0), 0);

    const metrics = selectDualCurrencyMetrics(transactions);
    const socialPremium = metrics.socialPremium; // Total token value / fiat equivalent

    const poolHealth = pool.healthScore || 0;
    let phColor = "text-red-400";
    if (poolHealth > 0.8) phColor = "text-emerald-400";
    else if (poolHealth >= 0.5) phColor = "text-yellow-400";

    const premiumColor = socialPremium >= 1.0 ? "text-emerald-400" : "text-red-400";

    return (
        <div className="grid grid-cols-5 gap-4">
            {/* 1. Circulation */}
            <div className="bg-navy-surface border border-navy-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Activity size={16} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Circulation</h3>
                </div>
                <div className="text-2xl font-mono font-bold text-amber-500">
                    {tokenCirculation.toFixed(1)} <span className="text-sm font-sans text-amber-500/50">hrs</span>
                </div>
            </div>

            {/* 2. Pool Health */}
            <div className="bg-navy-surface border border-navy-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <ShieldCheck size={16} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Pool Health</h3>
                </div>
                <div className={`text-2xl font-mono font-bold ${phColor}`}>
                    {(poolHealth * 100).toFixed(0)}%
                </div>
            </div>

            {/* 3. Active Agents */}
            <div className="bg-navy-surface border border-navy-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Users size={16} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Active Agents</h3>
                </div>
                <div className="text-2xl font-mono font-bold text-teal-400">
                    {activeAgents}<span className="text-sm font-sans text-slate-500">/{agents.length}</span>
                </div>
            </div>

            {/* 4. Gini Coefficient */}
            <div className="bg-navy-surface border border-navy-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <BarChart2 size={16} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Token Gini</h3>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-200">
                    {latestGini.toFixed(2)}
                </div>
            </div>

            {/* 5. Social Premium */}
            <div className="bg-navy-surface border border-navy-border rounded-lg p-4 relative overflow-hidden">
                {/* Glow effect */}
                <div className={`absolute -right-4 -bottom-4 w-16 h-16 blur-2xl opacity-20 ${socialPremium >= 1.0 ? "bg-emerald-500" : "bg-red-500"}`}></div>

                <div className="flex items-center gap-2 text-slate-400 mb-2 relative z-10">
                    <Coins size={16} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Social Premium</h3>
                </div>
                <div className={`text-2xl font-mono font-bold relative z-10 ${premiumColor}`}>
                    {socialPremium.toFixed(2)}x
                </div>
            </div>
        </div>
    );
}
