"use client";

import React, { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const TaskCard = ({ _id, title, priority, description, agentName, _creationTime, status, agentNotes, feedback }) => {
  const completeTask = useMutation(api.tasks.completeTask);
  const requestRevision = useMutation(api.tasks.requestRevision);

  const isUrgent = priority <= 2;
  const isReview = status === 'review';
  const isRevision = !!feedback && status !== 'done';
  
  // Dynamic styling based on status
  const accentColor = isReview ? 'border-l-blue-500' : isUrgent ? 'border-l-red-500' : 'border-l-yellow-500';
  const badgeStyles = isReview
    ? 'border-blue-900/50 text-blue-400 bg-blue-950/30'
    : isUrgent 
      ? 'border-red-900/50 text-red-500 bg-red-950/30' 
      : 'border-yellow-900/50 text-yellow-500 bg-yellow-950/30';

  const [remainingText, setRemainingText] = useState('');
  
  useEffect(() => {
    const timeRemaining = priority === 1 ? 60 : priority === 2 ? 120 : 180;
    const deadline = new Date(_creationTime).getTime() + timeRemaining * 60000;

    const update = () => {
      const diff = Math.max(0, Math.floor((deadline - Date.now()) / 60000));
      setRemainingText(`${diff}M REMAINING`);
    };

    if (status !== 'done' && status !== 'review') {
      update();
      const id = setInterval(update, 60000);
      return () => clearInterval(id);
    }
  }, [_creationTime, priority, status]);

  const handleReject = () => {
    const reason = prompt("ENTER REJECTION FEEDBACK FOR AGENT:");
    if (reason) {
      requestRevision({ taskId: _id, feedback: reason });
    }
  };

  return (
    <div className={`bg-[#0A0A0A] border border-zinc-800 border-l-4 ${accentColor} p-5 rounded-lg hover:border-zinc-600 transition-all shadow-xl group relative`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${badgeStyles}`}>
          {isReview ? 'PENDING REVIEW' : isUrgent ? 'URGENT' : 'HIGH'}
        </span>
        <span className="text-[10px] text-zinc-700 group-hover:text-zinc-500 font-bold">#ID-{_creationTime.toString().slice(-4)}</span>
      </div>

      <h3 className="text-zinc-100 font-bold text-sm mb-2 uppercase tracking-tight leading-snug">{title}</h3>
      
      {/* NOVA FEEDBACK ALERT (Visible if task was rejected) */}
      {isRevision && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-[10px] text-red-400">
          <span className="font-bold block uppercase text-[8px] mb-1 tracking-widest">⚠️ Revision Feedback:</span>
          "{feedback}"
        </div>
      )}

      <p className="text-zinc-500 text-[11px] leading-relaxed mb-4 font-medium uppercase tracking-tighter line-clamp-2">{description}</p>

      {/* SUB-AGENT NOTES (Visible in Review) */}
      {isReview && agentNotes && (
        <div className="mb-4 p-2 bg-blue-500/5 border border-blue-500/20 rounded text-[10px] text-blue-300 italic">
          <span className="font-bold block not-italic mb-1 text-blue-500 text-[8px] tracking-widest uppercase">Sub-Agent Summary:</span>
          "{agentNotes}"
        </div>
      )}

      {/* ACTION LAYER FOR REVIEW STATUS */}
      {isReview && (
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => completeTask({ taskId: _id })}
            className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all"
          >
            APPROVE
          </button>
          <button 
            onClick={handleReject}
            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all"
          >
            REJECT
          </button>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] text-zinc-400 font-bold uppercase">
            {agentName ? agentName[0] : '?'}
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{agentName}</span>
        </div>
        
        {status === 'done' ? (
          <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter">MISSION ACCOMPLISHED</span>
        ) : isReview ? (
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter animate-pulse">AWAITING VERIFICATION</span>
        ) : (
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-tighter tabular-nums">{remainingText}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
