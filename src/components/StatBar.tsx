"use client";
import React, { useState, useEffect } from 'react';

const StatBar = ({ taskCount = 0 }) => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between px-6 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">Sector:</span>
          <span className="text-zinc-200">XI-DELTA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">Latency:</span>
          <span className="text-green-500 font-bold">24ms</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-zinc-500">
        <div>Agents_Active: <span className="text-zinc-200">03</span></div>
        <div className="text-zinc-800">|</div>
        <div>Tasks_In_Queue: <span className="text-zinc-200 font-mono text-xs">{taskCount.toString().padStart(2, '0')}</span></div>
      </div>

      <div className="font-mono text-zinc-300 min-w-[80px] text-right">
        {time || "--:--:--"}
      </div>
    </div>
  );
};

export default StatBar;
