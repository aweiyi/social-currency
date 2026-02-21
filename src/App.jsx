import React, { useState } from "react";
import { useSimStore } from "./store/useSimStore";
import { Header } from "./components/Header";
import { ControlPanel } from "./components/ControlPanel";
import { StatCards } from "./components/StatCards";
import { AgentList } from "./components/AgentList";
import { Dashboard } from "./components/Dashboard";
import { EventFeed } from "./components/EventFeed";

import { AgentDetail } from "./components/AgentDetail";

function App() {
  const selectedAgentId = useSimStore((state) => state.selectedAgentId);

  return (
    <div className="h-screen w-screen flex flex-col bg-navy-base text-slate-100 overflow-hidden font-sans">
      <Header />

      <div className="p-4 border-b border-navy-border flex-shrink-0">
        <ControlPanel />
      </div>

      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Left Panel: Agent List */}
        <div className="w-[320px] flex-shrink-0 flex flex-col h-full">
          <AgentList />
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-shrink-0">
            <StatCards />
          </div>

          <div className="flex-1 flex overflow-hidden gap-4">
            {selectedAgentId ? (
              <AgentDetail />
            ) : (
              <Dashboard />
            )}
            <EventFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;