# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file first for better caching
COPY requirements.txt .

# Update pip to the latest version (optional but recommended)
RUN pip install --upgrade pip

# Install dependencies with increased timeout and alternative mirror
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt \
    --index-url https://pypi.tuna.tsinghua.edu.cn/simple

# Copy the rest of the application code
COPY . .

# Command to run the application
CMD ["python", "main.py"]
