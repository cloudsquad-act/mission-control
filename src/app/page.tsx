"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import TaskBoard from '@/components/TaskBoard';
import LiveFeed from '@/components/LiveFeed';
//import { AgentHeartbeat } from '@/components/AgentHeartbeat';

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-black overflow-hidden font-sans selection:bg-blue-500/30">
      {/* The Header now sits at the very top, full width */}
      <DashboardHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar now starts below the header */}
        <Sidebar />
        
        <div className="flex flex-1 overflow-hidden bg-zinc-950/50">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <TaskBoard />
          </div>
          <div className="w-[380px] border-l border-zinc-900 bg-black/20 overflow-y-auto">
            <LiveFeed />
          </div>
        </div>
      </div>
    </main>
  );
}
