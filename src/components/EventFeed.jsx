import React from "react";
import { useSimStore } from "../store/useSimStore";
import { AlertTriangle, Info, ArrowRightLeft, ShieldCheck, TrendingUp, Sparkles, Activity } from "lucide-react";
import { generateNarrative, buildEventExplanationPrompt } from "../utils/groq";
import { useState } from "react";

export function EventFeed() {
    const events = useSimStore((state) => state.events);
    const [filter, setFilter] = React.useState("all");
    const [explainingId, setExplainingId] = useState(null);
    const [narratives, setNarratives] = useState({}); // { eventKey: narrative }
    const [error, setError] = useState("");

    const handleExplain = async (event, key) => {
        setExplainingId(key);
        setError("");
        try {
            const apiKey = import.meta.env.VITE_GROQ_API_KEY;
            const prompt = buildEventExplanationPrompt(event);
            const result = await generateNarrative(prompt, apiKey);
            setNarratives(prev => ({ ...prev, [key]: result }));
        } catch (err) {
            setError(err.message === "GROQ_API_KEY_MISSING" ? "API Key missing" : "Analysis failed");
        } finally {
            setExplainingId(null);
        }
    };

    const filteredEvents = React.useMemo(() => {
        if (filter === "all") return events;
        return events.filter(e => {
            if (filter === "issuance") return e.type === "token_issued" || e.type === "exchange";
            if (filter === "default") return e.type === "default";
            if (filter === "pool") return e.type === "pool_claim" || e.type === "volunteer_absorbed";
            return true;
        });
    }, [events, filter]);

    const getEventIcon = (type) => {
        switch (type) {
            case "token_issued": return "🤝";
            case "token_redeemed": return "✅";
            case "default": return "❌";
            case "pool_claim": return "🛡️";
            case "volunteer_absorbed": return "🦸";
            case "price_swing": return "📈";
            case "large_trade": return "💰";
            default: return "ℹ️";
        }
    };

    const getEventColor = (type) => {
        switch (type) {
            case "default": return "border-red-500/30 bg-red-500/5 text-red-100";
            case "pool_claim": return "border-teal-500/30 bg-teal-500/5 text-teal-100";
            case "volunteer_absorbed": return "border-purple-500/30 bg-purple-500/5 text-purple-100";
            case "token_issued": return "border-amber-500/30 bg-amber-500/5 text-amber-100";
            case "token_redeemed": return "border-emerald-500/30 bg-emerald-500/5 text-emerald-100";
            case "price_swing": return "border-blue-500/30 bg-blue-500/5 text-blue-100";
            default: return "border-slate-800 bg-slate-800/40 text-slate-300";
        }
    };

    const feedRef = React.useRef(null);
    React.useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = 0; // Newest first at top
        }
    }, [events]);

    return (
        <div className="w-80 flex-shrink-0 border-l border-navy-border bg-navy-base/20 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-navy-border bg-navy-base/40">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Network Terminal</h3>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded leading-none uppercase">
                        Live Logs
                    </span>
                </div>
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                    {["all", "issuance", "default", "pool"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-all border ${filter === f ? "bg-slate-700 text-slate-100 border-slate-600" : "text-slate-500 border-transparent hover:text-slate-300"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div ref={feedRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 text-xs text-slate-600">
                        Waiting for network activity...
                    </div>
                )}

                {[...filteredEvents].reverse().map((event, idx) => (
                    <div
                        key={`${event.tick}-${idx}`}
                        className={`p-2.5 rounded border text-[11px] leading-relaxed transition-all duration-300 hover:brightness-110 ${getEventColor(event.type)}`}
                    >
                        <div className="flex items-center justify-between mb-1.5 opacity-60">
                            <span className="font-mono text-[9px] tracking-tighter">TICK {event.tick}</span>
                            <span className="text-xs">{getEventIcon(event.type)}</span>
                        </div>
                        <div className="font-medium tracking-tight text-slate-300">
                            {event.message}
                        </div>

                        {(event.type === "default" || event.type === "pool_claim") && (
                            <div className="mt-2 pt-2 border-t border-navy-border/30">
                                {!narratives[`${event.tick}-${idx}`] ? (
                                    <button
                                        onClick={() => handleExplain(event, `${event.tick}-${idx}`)}
                                        disabled={explainingId === `${event.tick}-${idx}`}
                                        className="flex items-center gap-1 text-[9px] font-bold uppercase text-amber-500/70 hover:text-amber-500 transition-colors disabled:opacity-50"
                                    >
                                        {explainingId === `${event.tick}-${idx}` ? (
                                            <Activity size={10} className="animate-pulse" />
                                        ) : (
                                            <Sparkles size={10} />
                                        )}
                                        {explainingId === `${event.tick}-${idx}` ? "Analyzing..." : "Explain Event"}
                                    </button>
                                ) : (
                                    <div className="text-[10px] text-slate-400 italic leading-snug animate-in fade-in slide-in-from-left-1">
                                        "{narratives[`${event.tick}-${idx}`]}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
