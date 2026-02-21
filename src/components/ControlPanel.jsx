import React from "react";
import { useSimStore } from "../store/useSimStore";
import { Play, Pause, RotateCcw, FastForward, AlertTriangle } from "lucide-react";

export function ControlPanel() {
    const tick = useSimStore((state) => state.tick);
    const reset = useSimStore((state) => state.reset);
    const isRunning = useSimStore((state) => state.isRunning);
    const toggleRunning = useSimStore((state) => state.toggleRunning);
    const speed = useSimStore((state) => state.speed);
    const setSpeed = useSimStore((state) => state.setSpeed);
    const selectedAgentId = useSimStore((state) => state.selectedAgentId);
    const triggerDefault = useSimStore((state) => state.triggerDefault);

    const handleReset = () => {
        reset();
    };

    return (
        <div className="flex items-center gap-6 px-4">
            <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Current Tick</span>
                <div className="text-3xl font-mono font-bold text-amber-500">
                    {tick.toString().padStart(4, "0")}
                </div>
            </div>

            <div className="h-10 w-px bg-navy-border"></div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleRunning}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold transition-all ${isRunning
                        ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20"
                        }`}
                >
                    {isRunning ? (
                        <>
                            <Pause size={18} fill="currentColor" /> PAUSE
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" /> PLAY
                        </>
                    )}
                </button>

                <button
                    onClick={handleReset}
                    className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title="Reset Simulation"
                >
                    <RotateCcw size={20} />
                </button>

                {selectedAgentId && (
                    <button
                        onClick={() => triggerDefault(selectedAgentId)}
                        className="p-2 rounded-md text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Force Default (Test)"
                    >
                        <AlertTriangle size={20} />
                    </button>
                )}
            </div>

            <div className="h-10 w-px bg-navy-border"></div>

            <div className="flex flex-col flex-1 max-w-[200px]">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span className="flex items-center gap-1 uppercase tracking-wider"><FastForward size={14} /> Speed</span>
                    <span className="text-slate-200 font-mono">{speed}x</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
            </div>
        </div>
    );
}
