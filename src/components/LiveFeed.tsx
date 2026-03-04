"use client";

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const LiveFeed = () => {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  
  // FIX: Calling the correct function name 'getFilteredLogs'
  const logs = useQuery(api.tasks.getFilteredLogs, { 
    category: filter === 'all' ? undefined : filter 
  });

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'task', label: 'TASKS' },
    { id: 'comment', label: 'COMMENTS' },
    { id: 'decision', label: 'DECISIONS' }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button 
            key={cat.id}
            className={`text-[10px] uppercase px-3 py-1 rounded-full border transition-all ${
              (filter === cat.id || (filter === undefined && cat.id === 'all'))
              ? 'bg-zinc-100 text-black border-zinc-100' 
              : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
            }`}
            onClick={() => setFilter(cat.id === 'all' ? undefined : cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-500 mb-4 flex items-center justify-between">
        LIVE FEED <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </h2>

      <div className="overflow-y-auto space-y-4">
        {logs?.map((log, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className={`w-2 h-2 rounded-full ${
              log.action === 'completion' ? 'bg-green-500' : 
              log.action === 'assignment' ? 'bg-blue-500' : 'bg-yellow-500'
            } mr-2`} />
            <span className="text-zinc-500 uppercase">{log.agent} // {log.action}</span>
            <span className="text-gray-400 text-[10px] ml-2">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {logs?.length === 0 && (
          <div className="text-zinc-800 text-[10px] uppercase text-center mt-10">No logs found in this category</div>
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
