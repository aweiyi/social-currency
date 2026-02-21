import React from "react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-navy-border bg-navy-base px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
          <span>🪙</span> FavourNet
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Simulating 180 Network School members | Social tokens + Fiat
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Economy Mode</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-sm font-semibold text-teal-400 flex items-center gap-1">
              <span>🪙</span> 67% Social
            </div>
            <div className="w-16 h-1.5 bg-slate-700 flex rounded-full overflow-hidden">
              <div className="h-full bg-teal-400" style={{ width: "67%" }}></div>
              <div className="h-full bg-emerald-500" style={{ width: "33%" }}></div>
            </div>
            <div className="text-sm font-semibold text-emerald-500 flex items-center gap-1">
              <span>💵</span> 33% Fiat
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
