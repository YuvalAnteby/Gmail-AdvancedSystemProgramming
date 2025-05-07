# This dockerfile is for solely running the client itself - not for tests
# Author: Yuval Anteby

# Pick the python version
FROM python:3.11-slim
# Copy and set the client in the container
WORKDIR /app/src
COPY . /app
# If ever needed despite TAs instruction - add requirements.txt file here
# RUN pip install --no-cache-dir -r requirements.txt

# Set default command
CMD ["python", "main.py", "server_cpp", "42069"]
