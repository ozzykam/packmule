#!/bin/bash
# Debug: Print the PORT variable
echo "PORT environment variable: '$PORT'"
# Use 8000 if PORT is not set or empty
if [ -z "$PORT" ]; then
    export PORT=8000
fi
echo "Using port: $PORT"
exec uvicorn main:app --host 0.0.0.0 --port $PORT