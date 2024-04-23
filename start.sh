#!/bin/bash

# Set the port number from the first argument, default to 3000 if not provided
PORT=5555

LOG_FILE="nohup-${PORT}.log"

# Run npm run dev in the background
nohup npm run dev -- --port=$PORT &> "${LOG_FILE}" &

# Save the PID of the background process to a file
echo $! > "npm-${PORT}.pid"

