import { SKILL_CATEGORIES } from "./data/categories";
import { useSimStore } from "./store/useSimStore";

function App() {
  const agents = useSimStore((s) => s.agents);
  const tick = useSimStore((s) => s.tick);
  const runTick = useSimStore((s) => s.runTick);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-bold text-amber-400 mb-4">
        🪙 FavourNet
      </h1>
      <p className="text-slate-400 mb-6">
        Loaded {agents.length} agents |{" "}
        {Object.keys(SKILL_CATEGORIES).length} skill categories
        {" · "}
        Tick: {tick}
      </p>
      <button
        type="button"
        onClick={runTick}
        className="mb-4 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30"
      >
        Run 1 tick
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {agents.slice(0, 12).map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900 border border-slate-700 rounded-lg p-3"
          >
            <div className="text-2xl mb-1">{agent.emoji}</div>
            <div className="font-medium text-sm">{agent.name}</div>
            <div className="text-xs text-slate-500">{agent.background}</div>
            <div className="mt-2 text-amber-400 text-sm font-mono">
              Price: {(agent.marketPrice ?? 0).toFixed(2)}
            </div>
            <div className="text-xs text-teal-400">
              Style: {agent.economic_style}
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-500 mt-6 text-sm">
        Showing first 12 of {agents.length} agents. Phase 2 engine + store
        ready — run ticks to simulate.
      </p>
    </div>
  );
}

export default App;