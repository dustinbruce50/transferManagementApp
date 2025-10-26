#!/bin/sh
# Startup script for transferManagementApp with fallback
SESSION=transferapp

tmux kill-session -t $SESSION 2>/dev/null
# Try to start main server.js with nodemon in tmux
tmux new-session -d -s $SESSION "npx nodemon server.js"
sleep 5

# Check if nodemon is running (by checking tmux pane for 'node' process)
if ! tmux capture-pane -pt $SESSION | grep -q "server is running"; then
    echo "Main server.js failed, starting fallback server.old.js"
    tmux kill-session -t $SESSION
    tmux new-session -d -s $SESSION "npx nodemon server.old.js"
fi



while tmux has-session -t $SESSION 2>/dev/null; do
    sleep 60
done