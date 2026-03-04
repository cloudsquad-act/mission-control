"use client";

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Sidebar = () => {
  const tasks = useQuery(api.tasks.getTasks) || [];
  const agents = useQuery(api.agents.getAgents) || [];

  return (
    <div className="w-72 bg-[#050505] border-r border-zinc-800/80 flex flex-col h-full font-mono">
      {/* RESTORED HEADER */}
      <div className="p-6 border-b border-zinc-800/80 flex justify-between items-center">
        <h2 className="text-[15px] font-black tracking-[0.2em] text-zinc-100 uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> AGENTS
        </h2>
        <span className="text-[12px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-bold">
          {agents.length} TOTAL
        </span>
      </div>

      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        {agents.map((agent) => {
          const isActive = tasks.some(t => t.agentName.toUpperCase() === agent.name.toUpperCase() && t.status === 'doing');
          
          return (
            <div key={agent._id} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
              isActive ? "bg-zinc-900/60 border-zinc-700" : "bg-transparent border-transparent"
            }`}>
              {/* Profile Icon */}
              <div className="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center text-xl bg-zinc-900/50 shadow-inner">
                {agent.icon}
              </div>
              
              {/* Agent Info - NOW READABLE */}
              <div className="flex flex-col">
                <span className="text-[18px] font-bold text-zinc-100 tracking-tight uppercase">{agent.name}</span>
                <span className="text-[13px] text-zinc-500 font-medium uppercase tracking-tight">{agent.role}</span>
              </div>

              {/* Status Badge */}
              {isActive && (
                <div className="ml-auto">
                  <span className="text-[8px] font-black text-green-500 border border-green-500/40 px-1.5 py-0.5 rounded tracking-widest uppercase bg-green-500/10">ACTIVE</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CLEAN BOTTOM FOOTER */}
      <div className="mt-auto p-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
