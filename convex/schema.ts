import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(), // "todo", "doing", "review", "completed"
    priority: v.number(),
    agentName: v.string(),
    acceptanceCriteria: v.string(),
    // New "Surgical" Fields
    agentNotes: v.optional(v.string()), 
    feedback: v.optional(v.string()),
    reportPath: v.optional(v.string()),
  }),
  logs: defineTable({
    agent: v.string(),
    action: v.string(),
    timestamp: v.number(),
    category: v.optional(v.string()),
    taskId: v.optional(v.id("tasks")),
  }),
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    icon: v.string(),
    color: v.string(),
    soulPath: v.string(), 
  }),
});
