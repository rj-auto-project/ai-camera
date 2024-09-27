#!/bin/bash

echo "Current working directory: $(pwd)"
echo "Contents of current directory:"
ls -la

if [ -d "mediamtx" ]; then
    echo "mediamtx directory found"
    cd mediamtx
    echo "Contents of mediamtx directory:"
    ls -la
    if [ -f "./mediamtx" ]; then
        echo "Running mediamtx"
        ./mediamtx &
    else
        echo "mediamtx executable not found"
    fi
    cd ..
else
    echo "mediamtx directory not found"
fi

if [ -f "main.py" ]; then
    echo "Running main.py"
    python3 main.py
else
    echo "main.py not found"
    echo "Contents of /app directory:"
    ls -la /app
fi