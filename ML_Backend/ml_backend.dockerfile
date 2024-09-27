# Use an official Python runtime as a parent image
FROM python:3.9
# Set the working directory
WORKDIR /app

# Copy the requirements file first for better caching
COPY requirements.txt .

# Update pip to the latest version (optional but recommended)
RUN pip install --upgrade pip

RUN pip install numpy==1.26.4
RUN pip install ultralytics==8.2.82
RUN pip install torch==2.4.0
RUN pip install tensorflow==2.17.0
RUN pip install opencv-python==4.10.0.84
RUN pip install scikit-image==0.17.2
RUN pip install pillow==10.4.0
RUN pip install redis==5.0.8
RUN pip install python-dotenv==1.0.1
RUN pip install filterpy==1.4.5
RUN pip install lap==0.4.0
RUN pip install psycopg2-binary==2.9.9
# Install dependencies with increased timeout and alternative mirror

# Install dependencies with increased timeout and alternative mirror
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    libgl1-mesa-glx \
    libglib2.0-0 && \
    apt-get clean

# Copy the rest of the application code
COPY . .

# Copy the run script and give it execute permissions
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh
RUN ls -l /app/run.sh
# Expose the port
EXPOSE 8000

# Use the shell script as the entry point
CMD ["/app/run.sh"]