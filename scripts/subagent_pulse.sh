#!/bin/bash
tasks=$(npx convex run tasks:getTasks)
agents=("aura" "telos" "lyra")

for agent in "${agents[@]}"; do
    todo_count=$(echo "$tasks" | jq "[.[] | select(.agentName != null) | select(.agentName | ascii_downcase == \"$agent\") | select(.status == \"todo\")] | length")

    if [ "$todo_count" -gt 0 ]; then
        echo "🔔 MISSION FOUND: $agent has $todo_count task(s). Forcing Execution..."
        
        # We use --deliver to ensure the agent doesn't just 'receive' but 'executes'
        # We also add a timeout to give her time to actually run the tools
        openclaw agent --to "$agent" --deliver --message "COMMAND: HEARTBEAT_SIGNAL. 
        1. Run 'npx convex run tasks:getTasks'. 
        2. Move the oldest 'todo' task for $agent to 'doing'.
        3. PERFORM THE WORK (e.g. edit files).
        4. Run 'npx convex run tasks:requestReview' when finished.
        STAY ACTIVE UNTIL THE TASK MOVES TO REVIEW."
    else
        echo "💤 $agent: No pending 'todo' work. Remaining idle."
    fi
done
