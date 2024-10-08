# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the requirements file first for better caching
COPY requirements.txt .

# Update pip to the latest version
RUN pip install --upgrade pip

# Install numpy first to resolve dependency issues with scikit-image
RUN pip install --no-cache-dir numpy==1.26.4


# Install the rest of the dependencies
RUN pip install --no-cache-dir \
ultralytics==8.2.82 \
torch==2.4.0 \
tensorflow==2.17.0 \
opencv-python==4.10.0.84 \
scikit-image==0.17.2 \
pillow==10.4.0 \
redis==5.0.8 \
python-dotenv==1.0.1 \
filterpy==1.4.5 \
lap==0.4.0 \
psycopg2-binary==2.9.9

# Installing Cuda in docker
FROM nvidia/cuda:12.6.1-cudnn-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y \
    python3-pip \
    && pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu113

# Install dependencies for the system (ffmpeg, OpenCV dependencies, etc.)
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    libgl1-mesa-glx \
    libglib2.0-0 \
    dos2unix && \
    apt-get clean

# Copy the rest of the application code
COPY . .

# Copy the run script, convert line endings, and give it execute permissions
COPY run.sh /app/run.sh
RUN dos2unix /app/run.sh && chmod +x /app/run.sh

# Expose the port
EXPOSE 8000

# Use the shell script as the entry point
CMD ["/bin/bash", "/app/run.sh"]
