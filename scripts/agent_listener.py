import os
import sys
import time
import argparse
from dotenv import load_dotenv
from convex import ConvexClient

# Load Environment
env_path = os.path.expanduser("~/mission-control/.env.local")
load_dotenv(env_path)
client = ConvexClient(os.getenv("NEXT_PUBLIC_CONVEX_URL"))

def process_mission(agent_name):
    base_path = os.path.expanduser(f"~/mission-control/agents/{agent_name}")
    
    # 1. Find the current task directory (the one that is 'doing')
    try:
        tasks = client.query("tasks:getTasks")
        active_tasks = [t for t in tasks if t['status'] == 'doing' and t['agentName'].lower() == agent_name.lower()]
        
        for task in active_tasks:
            task_id = task['_id']
            task_dir = os.path.join(base_path, task_id)
            mission_file = os.path.join(task_dir, "mission.md")
            report_file = os.path.join(task_dir, f"{task_id}.report.md")

            if os.path.exists(mission_file) and not os.path.exists(report_file):
                print(f"🤖 {agent_name} found mission: {task_id}")
                
                # SIMULATED AI WORK: In a real setup, this is where you'd call Claude/GPT
                # For this test, we generate a simple automated report
                with open(report_file, "w") as f:
                    f.write(f"# REPORT: {task['title']}\n\n")
                    f.write(f"Audit completed successfully.\n")
                    f.write(f"Suggested Icons: Phosphor-Ghost, Phosphor-Target, Phosphor-Shield.\n")

                # 2. Tell the system we are ready for review
                client.mutation("tasks:requestReview", {
                    "taskId": task_id,
                    "summary": "Audit complete. Suggested 3 new tactical icons.",
                    "reportPath": report_file
                })
                print(f"✅ {agent_name} submitted report for {task_id}")

    except Exception as e:
        print(f"❌ Error in listener: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--agent", required=True)
    args = parser.parse_args()
    
    print(f"📡 {args.agent.upper()} listener activated...")
    while True:
        process_mission(args.agent)
        time.sleep(10) # Checks every 10 seconds (faster than cron)
