"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import TaskCard from './TaskCard';

const TaskBoard = () => {
  const tasks = useQuery(api.tasks.getTasks);
  const addRawTask = useMutation(api.tasks.addRawTask);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRawTask({
      title,
      description,
    });
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const getColumnLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'INBOX';
      case 'doing': return 'IN PROGRESS';
      case 'review': return 'UNDER REVIEW';
      case 'done': return 'COMPLETED';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] font-mono relative">
      <div className="flex flex-row items-center justify-between px-8 py-6 border-b border-zinc-800/80 bg-zinc-900/10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            MISSION CONTROL
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 bg-orange-500/10 text-orange-500 border border-orange-500/40 px-6 py-2 rounded-sm text-[12px] font-bold tracking-[0.2em] hover:bg-orange-500/20 hover:border-orange-500 transition-all uppercase"
        >
          + New
        </button>
      </div>

      <div className="flex-1 p-6 grid grid-cols-4 gap-6 overflow-hidden">
        {['todo', 'doing', 'review', 'done'].map((status) => (
          <div key={status} className={`flex flex-col bg-zinc-900/20 border ${status === 'review' ? 'border-blue-500/30 bg-blue-500/5' : 'border-zinc-800/60'} rounded-xl overflow-hidden shadow-inner`}>
            <div className={`p-4 border-b ${status === 'review' ? 'border-blue-500/30 bg-blue-900/20' : 'border-zinc-800/80 bg-zinc-900/40'} flex justify-between items-center`}>
              <span className={`text-[11px] font-bold tracking-[0.3em] uppercase ${status === 'review' ? 'text-blue-400' : 'text-zinc-300'}`}>
                {getColumnLabel(status)}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status === 'review' ? 'bg-blue-950 text-blue-300 border-blue-500/50' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {tasks?.filter(t => t.status === status).length || 0}
              </span>
            </div>

            <div className="p-4 flex flex-col gap-5 overflow-y-auto custom-scrollbar h-full">
              {tasks?.filter(t => t.status === status).map((task) => (
                <TaskCard key={task._id} {...task} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-8 rounded-lg shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-orange-500 font-black tracking-widest text-lg uppercase italic underline decoration-orange-500/30 underline-offset-8">
                  Raw Mission Entry
                </h2>
                <p className="text-[9px] text-zinc-500 mt-2 tracking-tight">PENDING TRIAGE BY LEAD AGENT NOVA</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-zinc-500 tracking-widest uppercase">Objective Title</label>
                <input 
                  autoFocus
                  className="bg-zinc-950 border border-zinc-800 p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors font-mono"
                  placeholder="E.g. ANALYZE_MARKET_TRENDS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-zinc-500 tracking-widest uppercase">Mission Brief (Raw Data)</label>
                <textarea 
                  rows={4}
                  className="bg-zinc-950 border border-zinc-800 p-3 text-white text-sm focus:border-orange-500/50 outline-none resize-none font-mono"
                  placeholder="Input raw instructions for Nova to process..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 text-[10px] text-zinc-500 hover:text-white tracking-widest uppercase font-bold transition-colors"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)]"
                >
                  Submit for Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
