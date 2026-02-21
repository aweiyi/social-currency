import React, { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useSimStore } from "../store/useSimStore";
import { SKILL_CATEGORIES } from "../data/categories.js";

function getAgentPrimaryDomain(agent) {
    let maxVal = -0.1;
    let topSkill = null;
    if (!agent.skills) return "unknown";

    for (const [cat, val] of Object.entries(agent.skills)) {
        if (val > maxVal) {
            maxVal = val;
            topSkill = cat;
        }
    }
    if (!topSkill) return "unknown";
    return SKILL_CATEGORIES[topSkill]?.domain || "unknown";
}

export function AgentList() {
    const agents = useSimStore((state) => state.agents);
    const selectedAgentId = useSimStore((state) => state.selectedAgentId);
    const setSelectedAgentId = useSimStore((state) => state.setSelectedAgentId);

    const [search, setSearch] = useState("");
    const [domainFilter, setDomainFilter] = useState("All");
    const [sortBy, setSortBy] = useState("price");
    const [showAll, setShowAll] = useState(false);

    const domains = ["All", "knowledge", "physical", "social", "wellness"];

    const filteredAndSortedAgents = useMemo(() => {
        let result = agents;

        if (search.trim() !== "") {
            const q = search.toLowerCase();
            result = result.filter((a) => a.name.toLowerCase().includes(q));
        }

        if (domainFilter !== "All") {
            result = result.filter((a) => {
                const domain = getAgentPrimaryDomain(a);
                return domain.toLowerCase() === domainFilter.toLowerCase();
            });
        }

        result = [...result].sort((a, b) => {
            if (sortBy === "price") {
                return (b.marketPrice ?? 0) - (a.marketPrice ?? 0);
            } else if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "volume") {
                const aVol = (a.tokens?.issued ?? 0) + (a.tokens?.redeemed ?? 0);
                const bVol = (b.tokens?.issued ?? 0) + (b.tokens?.redeemed ?? 0);
                return bVol - aVol;
            }
            return 0;
        });

        return result;
    }, [agents, search, domainFilter, sortBy]);

    const displayedAgents = showAll ? filteredAndSortedAgents : filteredAndSortedAgents.slice(0, 20);

    return (
        <div className="flex flex-col h-full bg-navy-surface border border-navy-border rounded-lg overflow-hidden flex-shrink-0">
            {/* Search and Filters */}
            <div className="p-3 border-b border-navy-border bg-navy-base/50 space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search 180 agents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                </div>

                {/* Domain Tabs */}
                <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                    {domains.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDomainFilter(d)}
                            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${domainFilter === d
                                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 border border-transparent"
                                }`}
                        >
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Sort Row */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        {filteredAndSortedAgents.length} results
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Sort:</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md pl-2 pr-6 py-1 focus:outline-none focus:border-slate-500 cursor-pointer"
                            >
                                <option value="price">Price</option>
                                <option value="name">Name</option>
                                <option value="volume">Volume</option>
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1.5 text-slate-500 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {displayedAgents.map((agent) => {
                    const isSelected = agent.id === selectedAgentId;
                    const price = agent.marketPrice ?? 0;
                    let priceColor = "text-red-400";
                    if (price >= 0.7) priceColor = "text-emerald-400";
                    else if (price >= 0.4) priceColor = "text-yellow-400";

                    return (
                        <div
                            key={agent.id}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors border ${isSelected
                                ? "bg-slate-800 border-amber-500/50"
                                : "bg-slate-900/50 border-transparent hover:bg-slate-800 hover:border-slate-700"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-full text-lg relative">
                                    {agent.emoji}
                                    {/* Status Dot */}
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${agent.isActive ? "bg-emerald-500" : "bg-red-500"
                                        }`}></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-200 leading-tight block truncate w-32">{agent.name}</span>
                                    <span className="text-xs text-slate-500 truncate w-32">{agent.economic_style}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className={`text-sm font-mono font-bold ${priceColor}`}>
                                    {price.toFixed(2)}
                                </span>
                                {/* Sparkline placeholder for now */}
                                <div className="w-10 h-3 flex items-end gap-0.5 mt-1">
                                    <div className="w-2 rounded-t-sm opacity-50 bg-current h-[40%]"></div>
                                    <div className="w-2 rounded-t-sm opacity-60 bg-current h-[60%]"></div>
                                    <div className="w-2 rounded-t-sm opacity-80 bg-current h-[80%]"></div>
                                    <div className="w-2 rounded-t-sm bg-current h-[100%]"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!showAll && filteredAndSortedAgents.length > 20 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="w-full py-2 mt-2 text-xs font-semibold text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-md transition-colors"
                    >
                        Show All {filteredAndSortedAgents.length} Agents
                    </button>
                )}
                {showAll && filteredAndSortedAgents.length > 20 && (
                    <button
                        onClick={() => setShowAll(false)}
                        className="w-full py-2 mt-2 text-xs font-semibold text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-md transition-colors"
                    >
                        Show Top 20 Only
                    </button>
                )}
                {filteredAndSortedAgents.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-500">
                        No agents found.
                    </div>
                )}
            </div>
        </div>
    );
}
