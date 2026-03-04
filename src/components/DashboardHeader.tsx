"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const DashboardHeader = () => {
  const tasks = useQuery(api.tasks.getTasks);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' }).toUpperCase());
    }, 1000);
    return () => clearInterval(t);
  }, []);
  
  const agentsActive = tasks?.filter(t => t.status === 'doing').length || 0;
  const tasksInQueue = tasks?.filter(t => t.status === 'todo').length || 0;

  return (
    <div className="flex items-center px-6 py-2 border-b border-zinc-900 bg-black/40 backdrop-blur-xl h-14">
      {/* 1. Environmental Data */}
      <div className="flex gap-8 border-r border-zinc-800/50 pr-8">
        <div className="flex flex-col">
          <span className="text-[12px] text-zinc-600 font-bold tracking-[0.2em] uppercase">Sector</span>
          <span className="text-[14px] text-zinc-300 font-mono">XI-DELTA</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-zinc-600 font-bold tracking-[0.2em] uppercase">Latency</span>
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-green-500 font-mono">24MS</span>
            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. System Status (Equally Distributed) */}
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Squad Status:</span>
            <span className={`text-[12px] font-bold tracking-[0.2em] ${agentsActive > 0 ? "text-green-500" : "text-amber-500/80"}`}>
              {agentsActive > 0 ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Uplink:</span>
            <span className="text-[14px] font-bold tracking-[0.2em] text-green-500/80">STABLE</span>
          </div>

          <div className="flex gap-8 items-center border-l border-zinc-800/50 pl-12 font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-zinc-600 tracking-widest font-bold uppercase">Active</span>
              <span className="text-[14px] text-zinc-200">{agentsActive.toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-zinc-600 tracking-widest font-bold uppercase">Queue</span>
              <span className="text-[14px] text-zinc-200">{tasksInQueue.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Stacked Time & Date (Right) */}
      <div className="flex flex-col items-end min-w-[120px] border-l border-zinc-800/50 pl-8">
        <span className="text-[18px] font-bold text-zinc-100 leading-none tracking-tight font-mono">{time}</span>
        <span className="text-[9px] font-bold text-zinc-500 tracking-[0.1em] mt-1">{date}</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
