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

# Check if main.py exists and run it in parallel with mediamtx
if [ -f "main.py" ]; then
    echo "Running main.py"
    python3 main.py &
else
    echo "main.py not found"
    echo "Contents of /app directory:"
    ls -la /app
fi

# Wait for all background processes to finish
wait
