import React, { useMemo } from "react";
import { useSimStore } from "../store/useSimStore";
import {
    X,
    TrendingUp,
    TrendingDown,
    Award,
    Coins,
    History,
    Activity,
    Zap,
    Share2
} from "lucide-react";
import { SKILL_CATEGORIES } from "../data/categories";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import { generateNarrative, buildAgentStoryPrompt } from "../utils/groq";
import { useState, useEffect } from "react";

export function AgentDetail() {
    const selectedAgentId = useSimStore((state) => state.selectedAgentId);
    const setSelectedAgentId = useSimStore((state) => state.setSelectedAgentId);
    const agents = useSimStore((state) => state.agents);
    const transactions = useSimStore((state) => state.transactions);
    const tokens = useSimStore((state) => state.tokens);
    const priceHistory = useSimStore((state) => state.priceHistory);

    const [narrative, setNarrative] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateStory = async () => {
        if (!agent) return;
        setIsLoading(true);
        setError("");
        try {
            const apiKey = import.meta.env.VITE_GROQ_API_KEY;
            const prompt = buildAgentStoryPrompt(agent, transactions.filter(tx => tx.from === agent.id || tx.to === agent.id).slice(-3));
            const result = await generateNarrative(prompt, apiKey);
            setNarrative(result);
        } catch (err) {
            if (err.message === "GROQ_API_KEY_MISSING") {
                setError("Groq API key missing. Set VITE_GROQ_API_KEY in .env");
            } else if (err.message === "RATE_LIMITED") {
                setError("Rate limited. Please try again later.");
            } else {
                setError("Could not generate story. Check your connection/API key.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const agent = useMemo(() => {
        const found = agents.find((a) => a.id === selectedAgentId);
        console.log("[AgentDetail] Selected ID:", selectedAgentId, "Found:", found?.name);
        return found;
    }, [agents, selectedAgentId]);

    useEffect(() => {
        setNarrative("");
        setError("");
        setIsLoading(false);
    }, [selectedAgentId]);

    if (!selectedAgentId || !agent) return null;

    // Derived stats
    const agentTransactions = useMemo(() =>
        transactions.filter(tx => tx.from === agent.id || tx.to === agent.id).reverse().slice(0, 10),
        [transactions, agent.id]
    );

    const heldTokens = useMemo(() =>
        tokens.filter(t => t.holder === agent.id && t.issuer !== agent.id && t.status === "active"),
        [tokens, agent.id]
    );

    const outstandingTokens = useMemo(() =>
        tokens.filter(t => t.issuer === agent.id && t.status === "active"),
        [tokens, agent.id]
    );

    // Obligation ratio: outstanding / (issued + 1)
    const obligationRatio = useMemo(() => {
        const issued = outstandingTokens.reduce((sum, t) => sum + (t.amount || 0), 0);
        const capacity = agent.weeklyCapacity || 10;
        return Math.min(issued / capacity, 1);
    }, [outstandingTokens, agent.weeklyCapacity]);

    // Price trend
    const priceTrend = useMemo(() => {
        if (priceHistory.length < 2) return 0;
        const lastEntry = priceHistory[priceHistory.length - 1];
        const prevEntry = priceHistory[priceHistory.length - 2];
        const last = lastEntry?.[agent.id] ?? agent.marketPrice;
        const prev = prevEntry?.[agent.id] ?? last;
        return last - prev;
    }, [priceHistory, agent.id, agent.marketPrice]);

    return (
        <div className="flex-1 bg-navy-surface border border-navy-border rounded-lg overflow-hidden flex flex-col h-full animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-navy-border bg-navy-base/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-4xl bg-slate-800/50 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-700">
                        {agent.emoji || "👤"}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">{agent.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${agent.isActive ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"
                                }`}>
                                {agent.isActive ? "Active Networker" : "DEFAULTED"}
                            </span>
                            <span className="text-xs text-slate-500 italic">{agent.economic_style}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedAgentId(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Price & Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-navy-base/30 border border-navy-border p-4 rounded-xl relative overflow-hidden">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Market Price</div>
                        <div className="flex items-end gap-2">
                            <div className="text-4xl font-mono font-bold text-amber-500 leading-none">
                                {(agent.marketPrice ?? 0).toFixed(2)}
                            </div>
                            {priceTrend !== 0 && (
                                <div className={`flex items-center gap-0.5 text-xs font-bold mb-1 ${priceTrend > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                    {priceTrend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(priceTrend).toFixed(3)}
                                </div>
                            )}
                        </div>
                        {/* Mini Sparkline placeholder logic - in real Recharts it would be: */}
                        <div className="absolute right-0 bottom-0 w-24 h-12 opacity-30">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={priceHistory.slice(-20)}>
                                    <Line type="monotone" dataKey={agent.id} stroke="#f59e0b" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-navy-base/30 border border-navy-border p-4 rounded-xl">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Obligation Ratio</div>
                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${obligationRatio > 0.8 ? "bg-red-500" : obligationRatio > 0.5 ? "bg-amber-500" : "bg-teal-500"
                                    }`}
                                style={{ width: `${obligationRatio * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 font-mono text-[10px] text-slate-500 uppercase">
                            <span>Utilization</span>
                            <span className="text-slate-300">{(obligationRatio * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                {/* Competencies */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <Zap size={14} /> Competencies & Reputation
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-3">
                            {Object.entries(agent.skills || {}).filter(([_, val]) => val > 0).map(([cat, val]) => (
                                <div key={cat} className="space-y-1">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-400">{SKILL_CATEGORIES[cat]?.emoji} {SKILL_CATEGORIES[cat]?.label}</span>
                                        <span className="text-slate-200 font-mono">{val}</span>
                                    </div>
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(val / 10) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-navy-base/20 border border-navy-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <Award size={32} className="text-amber-500/50 mb-2" />
                            <div className="text-3xl font-mono font-bold text-slate-100">
                                {agent.reputation?.overall?.toFixed(1) || "0.0"}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Reputation Score</div>
                            <div className="text-[10px] text-slate-600 mt-2 italic">
                                {agent.reputation?.attestations || 0} peer attestations
                            </div>
                        </div>
                    </div>
                </div>

                {/* Token Lists */}
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <Coins size={14} /> Tokens I Hold
                        </h3>
                        <div className="space-y-2">
                            {heldTokens.length === 0 ? (
                                <div className="text-[11px] text-slate-600 italic py-4 border border-dashed border-slate-800 rounded-lg text-center">
                                    No active social tokens held
                                </div>
                            ) : (
                                heldTokens.map((t, idx) => {
                                    const issuer = agents.find(a => a.id === t.issuer);
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-800/50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{issuer?.emoji || issuer?.avatar}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-200 leading-tight">{issuer?.name || "Unknown"}</span>
                                                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{t.category}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[11px] font-mono font-bold text-teal-400">{(t.amount || 0).toFixed(1)}h</div>
                                                <div className="text-[9px] text-slate-500">≈{((t.amount || 0) * (t.currentPrice || 0)).toFixed(1)}v</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <Activity size={14} /> My Outstanding
                        </h3>
                        <div className="space-y-2">
                            {outstandingTokens.length === 0 ? (
                                <div className="text-[11px] text-slate-600 italic py-4 border border-dashed border-slate-800 rounded-lg text-center">
                                    No social debt outstanding
                                </div>
                            ) : (
                                outstandingTokens.map((t, idx) => {
                                    const holder = agents.find(a => a.id === t.holder);
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-800/50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{holder?.emoji || holder?.avatar}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-200 leading-tight">{holder?.name || "Unknown"}</span>
                                                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Held By</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[11px] font-mono font-bold text-amber-500">{(t.amount || 0).toFixed(1)}h</div>
                                                <div className="text-[9px] text-slate-500">{t.category}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <History size={14} /> Activity Log
                    </h3>
                    <div className="space-y-1">
                        {agentTransactions.map((tx, idx) => {
                            const isFrom = tx.from === agent.id;
                            const otherId = isFrom ? tx.to : tx.from;
                            const other = agents.find(a => a.id === otherId);

                            return (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0 group">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded leading-none ${isFrom ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                                            }`}>
                                            {isFrom ? "OUT" : "IN"}
                                        </span>
                                        <div className="flex flex-col">
                                            <div className="text-[11px] text-slate-300">
                                                {isFrom ? `To ${other?.name || 'Network'}` : `From ${other?.name || 'Network'}`}
                                            </div>
                                            <div className="text-[9px] text-slate-500 uppercase">{tx.category} • Tick {tx.tick}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[11px] font-mono font-bold ${tx.paymentMethod === 'social_token' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {tx.tokenAmount ? `${tx.tokenAmount.toFixed(1)}h` : `$${tx.fiatAmount?.toFixed(0)}`}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Narrative Section */}
                <div className="pt-4 border-t border-navy-border/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Share2 size={14} className="text-amber-500" /> Narrative Deep Dive
                        </h3>
                        <button
                            onClick={handleGenerateStory}
                            disabled={isLoading}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${isLoading
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Activity size={12} className="animate-pulse" />
                                    Analyzing...
                                </>
                            ) : (
                                "Generate Story"
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] text-red-400 mb-4 animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    {narrative && !isLoading && (
                        <div className="p-4 bg-navy-base/40 border border-navy-border/50 rounded-xl relative overflow-hidden group animate-in zoom-in-95 duration-300">
                            {/* Terminal-style scanline effect */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-amber-500/5 to-transparent bg-[length:100%_4px] opacity-20"></div>
                            <p className="text-sm text-slate-300 leading-relaxed font-serif italic relative z-10">
                                "{narrative}"
                            </p>
                            <div className="mt-3 flex justify-end">
                                <span className="text-[9px] text-slate-600 uppercase font-mono">Verified by NS-Narrative-Core</span>
                            </div>
                        </div>
                    )}

                    {!narrative && !isLoading && !error && (
                        <div className="text-center py-6 border border-dashed border-navy-border/40 rounded-xl">
                            <p className="text-[11px] text-slate-600 italic">
                                Click 'Generate Story' to synthesize agent behavior into a narrative.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
