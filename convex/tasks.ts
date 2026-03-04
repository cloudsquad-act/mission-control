import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const getFilteredLogs = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("logs").order("desc").collect();
    return args.category ? logs.filter(log => log.category === args.category) : logs;
  },
});

export const startTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    await ctx.db.patch(args.taskId, { status: 'doing' });
    await ctx.db.insert("logs", {
      agent: task?.agentName || "System",
      taskId: args.taskId,
      action: 'engaged',
      category: 'task',
      timestamp: Date.now(),
    });
  },
});

export const getUnassigned = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("agentName"), "unassigned"))
      .collect();
  },
});

export const pulseTriage = mutation({
  args: {},
  handler: async (ctx) => {
    const unassigned = await ctx.db
      .query("tasks")
      .filter((q) => 
        q.and(
          q.eq(q.field("agentName"), "unassigned"),
          q.neq(q.field("status"), "done") // Ignore completed tasks
        )
      )
      .collect();

    if (unassigned.length > 0) {
      await ctx.db.insert("logs", {
        agent: "SYSTEM",
        action: "triage_required",
        category: "task",
        timestamp: Date.now(),
      });
    }
  },
});
export const addRawTask = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      priority: 3, // FIX: Default to HIGH instead of URGENT
      agentName: "unassigned",
      status: "todo",
      acceptanceCriteria: "TBD by Lead Agent",
    });

    await ctx.db.insert("logs", {
      agent: "SYSTEM",
      action: "inbox",
      category: "task",
      taskId: taskId,
      timestamp: Date.now(),
    });
  },
});

export const autoEngageNext = mutation({
  args: {},
  handler: async (ctx) => {
    const todoTasks = await ctx.db
      .query("tasks")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "todo"),
          q.neq(q.field("agentName"), "unassigned")
        )
      )
      .collect();
    
    if (todoTasks.length === 0) return null;
    const sorted = todoTasks.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a._creationTime - b._creationTime;
    });
    const target = sorted[0];
    await ctx.db.patch(target._id, { status: 'doing' });
    await ctx.db.insert("logs", {
      agent: target.agentName,
      taskId: target._id,
      action: 'engaged',
      category: 'task',
      timestamp: Date.now(),
    });
    return target._id;
  },
});

export const assignTask = mutation({
  args: { 
    taskId: v.id("tasks"), 
    agentName: v.string(), 
    acceptanceCriteria: v.string(),
    priority: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, { 
      agentName: args.agentName,
      acceptanceCriteria: args.acceptanceCriteria,
      priority: args.priority ?? 3, // FIX: Default to HIGH
    });

    await ctx.db.insert("logs", {
      agent: "NOVA",
      taskId: args.taskId,
      action: 'assignment',
      category: 'task',
      timestamp: Date.now(),
    });
  },
});

export const addTask = mutation({
  args: { title: v.string(), description: v.string(), priority: v.number(), agentName: v.string(), acceptanceCriteria: v.string(), },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      priority: args.priority,
      agentName: args.agentName,
      status: "todo",
      acceptanceCriteria: args.acceptanceCriteria,
    });

    await ctx.db.insert("logs", {
      agent: args.agentName,
      taskId: taskId,
      action: 'assignment',
      category: 'task',
      timestamp: Date.now(),
    });
    return taskId;
  },
});

export const requestReview = mutation({
  args: { 
    taskId: v.id("tasks"), 
    summary: v.string(),
    reportPath: v.string() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, { 
      status: "review", 
      agentNotes: args.summary,
      reportPath: args.reportPath
    });
    
    await ctx.db.insert("logs", {
      agent: "SYSTEM",
      action: "REVIEW_REQUESTED",
      timestamp: Date.now(),
      taskId: args.taskId,
      category: "status"
    });
  },
});

export const requestRevision = mutation({
  args: { 
    taskId: v.id("tasks"), 
    feedback: v.string() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, { 
      status: "todo",
      feedback: args.feedback 
    });
    
    await ctx.db.insert("logs", {
      agent: "NOVA",
      action: "REVISION_REQUESTED",
      timestamp: Date.now(),
      taskId: args.taskId,
      category: "status"
    });
  },
});

export const completeTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    await ctx.db.patch(args.taskId, { status: 'done' });
    await ctx.db.insert("logs", {
      agent: task?.agentName || "System",
      taskId: args.taskId,
      action: 'completion',
      category: 'decision',
      timestamp: Date.now(),
    });
  },
});

export const deleteLogs = mutation({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("logs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    const logs = await ctx.db.query("logs").collect();
    const agents = await ctx.db.query("agents").collect();

    for (const task of tasks) await ctx.db.delete(task._id);
    for (const log of logs) await ctx.db.delete(log._id);
    for (const agent of agents) await ctx.db.delete(agent._id);

    console.log("Mission Control cleared. System ready for new deployment.");
  },
});
