import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAgents = query({
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const seedAgents = mutation({
  handler: async (ctx) => {
    // 1. Force clear the table regardless of current schema
    const existing = await ctx.db.query("agents").collect();
    for (const agent of existing) {
      await ctx.db.delete(agent._id);
    }

    // 2. Insert the fresh 4-agent squad with required soulPaths
    const initialAgents = [
      { name: 'Nova', role: 'Lead Strategy', icon: '🤖', color: 'blue', soulPath: 'agents/nova/soul.md' },
      { name: 'Aura', role: 'Systems Spec', icon: '✨', color: 'purple', soulPath: 'agents/aura/soul.md' },
      { name: 'Telos', role: 'Intelligence', icon: '🧠', color: 'emerald', soulPath: 'agents/telos/soul.md' },
      { name: 'Lyra', role: 'UI/UX Spec', icon: '🎨', color: 'pink', soulPath: 'agents/lyra/soul.md' },
    ];

    for (const agent of initialAgents) {
      await ctx.db.insert("agents", agent);
    }
    
    return "SUCCESS: Squad synchronized with Soul Paths.";
  },
});
