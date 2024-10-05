#!/bin/bash

echo "Current working directory: $(pwd)"
echo "Contents of current directory:"
ls -la

# Check if the mediamtx directory exists
if [ -d "mediamtx" ]; then
    echo "mediamtx directory found"
    cd mediamtx
    echo "Contents of mediamtx directory:"
    ls -la
    
    # Check if mediamtx executable exists
    if [ -f "./mediamtx" ]; then
        echo "Setting execute permission for mediamtx"
        chmod +x ./mediamtx
        echo "Running mediamtx"
        # Run mediamtx in the background
        ./mediamtx &
        watch -n 1 nvidia-smi &
    else
        echo "mediamtx executable not found"
    fi
    cd ..
else
    echo "mediamtx directory not found"
fi

# Ensure mediamtx starts properly before running main.py
if [ -n "$mediamtx_pid" ]; then
    echo "Waiting for mediamtx to initialize..."
    sleep 5  # Add a delay to ensure mediamtx has time to initialize
fi

# Check if main.py exists and run it
if [ -f "main.py" ]; then
    echo "Running main.py"
    python3 main.py &
    main_pid=$!  # Store the process ID of main.py
    echo "main.py started with PID: $main_pid"
else
    echo "main.py not found"
    echo "Contents of /app directory:"
    ls -la /app
fi

# Wait for both processes (mediamtx and main.py) to finish
wait $mediamtx_pid
wait $main_pid

echo "Both mediamtx and main.py have completed"
