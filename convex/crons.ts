// Create this new file: convex/crons.ts
import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// This triggers the triage logic every 5 minutes
crons.interval(
  "Nova Triage Heartbeat",
  { minutes: 10 },
  api.tasks.pulseTriage, // Nova checks for new work
);

export default crons;
