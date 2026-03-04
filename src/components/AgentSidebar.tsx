import React from 'react';

const agents = [
  { name: 'Nova', role: 'Lead Agent', status: 'Working' },
  { name: 'Aura', role: 'Systems Specialist', status: 'Active' },
  { name: 'Telos', role: 'UI Specialist', status: 'Active' },
];

const AgentSidebar = () => {
  return (
    <div className="w-64 bg-zinc-900/50 border-r border-zinc-800 p-6 flex flex-col gap-8 h-full">
      <div>
        <h2 className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4">Active Squad</h2>
        <ul className="space-y-6">
          {agents.map((agent) => (
            <li key={agent.name} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <div>
                <p className="text-sm font-bold text-zinc-200">{agent.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase">{agent.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgentSidebar;
