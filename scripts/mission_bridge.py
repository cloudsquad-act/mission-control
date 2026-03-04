import os
import time
import subprocess
from dotenv import load_dotenv
from convex import ConvexClient

# Load Environment
env_path = os.path.expanduser("~/mission-control/.env.local")
load_dotenv(env_path)
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")
client = ConvexClient(CONVEX_URL)

def update_agent_workspace(agent_name, task):
    base_path = os.path.expanduser("~/mission-control/agents")
    task_id = task['_id']
    task_dir = os.path.join(base_path, agent_name.lower(), task_id)
    file_path = os.path.join(task_dir, "mission.md")
    
    # Check for Nova's rejection feedback
    feedback_text = task.get('feedback', None)
    
    try:
        os.makedirs(task_dir, exist_ok=True)
        
        with open(file_path, "w") as f:
            title_prefix = "⚠️ REVISION REQUIRED: " if feedback_text else ""
            f.write(f"# {title_prefix}{task['title']}\n\n")
            f.write(f"{task['description']}\n\n")
            f.write(f"AC: {task.get('acceptanceCriteria', 'TBD')}\n\n")
            
            if feedback_text:
                f.write(f"---\n")
                f.write(f"### 🛑 NOVA FEEDBACK\n")
                f.write(f"{feedback_text}\n")
                f.write(f"---\n\n")
            
            f.write(f"## SUB-AGENT INSTRUCTIONS\n")
            f.write(f"1. Complete the work based on the AC (and feedback if present).\n")
            f.write(f"2. Write your final report to: {task_id}.report.md in this folder.\n")
            f.write(f"3. Signal completion via the requestReview mutation.\n")
            
        print(f"✅ Prepared Workspace: {file_path}")
        
        # Signal the agent to start/resume work
        try:
            subprocess.run(['openclaw', 'signal', agent_name.lower(), '--path', task_dir], check=True)
            print(f"📡 Signaled {agent_name}")
        except Exception as e:
            print(f"⚠️ Signal failed: {e}")

        # Mark as 'doing' to turn the UI Yellow
        client.mutation("tasks:startTask", {"taskId": task_id})
    except Exception as e:
        print(f"❌ Error: {e}")

def monitor():
    print(f"🛰️ Bridge online. Watching for assigned tasks...")
    while True:
        try:
            tasks = client.query("tasks:getTasks")
            # Process tasks that are 'todo' and assigned to an agent
            pending = [t for t in tasks if t['status'] == 'todo' and t['agentName'] != 'unassigned']
            
            for task in pending:
                update_agent_workspace(task['agentName'], task)
        except Exception as e:
            print(f"📡 Connection error: {e}")
        time.sleep(5)

if __name__ == "__main__":
    monitor()
