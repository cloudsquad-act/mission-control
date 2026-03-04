import sys
import os
from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(os.path.expanduser("~/mission-control/.env.local"))
client = ConvexClient(os.getenv("NEXT_PUBLIC_CONVEX_URL"))

def complete(task_id):
    try:
        client.mutation("tasks:completeTask", {"taskId": task_id})
        print(f"✅ Task {task_id} marked COMPLETED in Convex.")
    except Exception as e:
        print(f"❌ Failed to complete task: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        complete(sys.argv[1])
