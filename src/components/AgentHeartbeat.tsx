"use client";

import { useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const AgentHeartbeat = () => {
  const tasks = useQuery(api.tasks.getTasks);
  const autoEngage = useMutation(api.tasks.autoEngageNext);

  useEffect(() => {
    const interval = setInterval(() => {
      // ONLY auto-assign if there is no one currently working
      const isAnyoneWorking = tasks?.some(t => t.status === 'doing');
      const hasPendingTasks = tasks?.some(t => t.status === 'todo' && t.agentName !== 'unassigned');
      
      if (!isAnyoneWorking && hasPendingTasks) {
        console.log("System Idle. Dispatching next priority mission...");
        autoEngage();
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [tasks, autoEngage]);

  return null;
};
