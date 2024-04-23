#!/bin/bash

# Set the port number from the first argument, default to 3000 if not provided
PORT=5555

# Run npm run dev in the background
nohup npm run dev -- --port=$PORT &> /dev/null &

# Save the PID of the background process to a file
echo $! > "npm-${PORT}.pid"

