# This dockerfile is for solely running the client itself - not for tests
# Author: dor darmon 

# Pick the python version
FROM python:3.11-slim
# Copy and set the client in the container
WORKDIR /app/src
COPY . /app
# If ever needed despite TAs instruction - add requirements.txt file here
#Install Python test dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Python test dependencies
RUN pip install pytest 
#Argument to determine whether to run or test IDEA mode.

ARG MODE=run
ENV MODE=${MODE}

# Default command depending on the mode:
#Take ARG in build AND runtime for more flexible container behaviour
CMD ["/bin/sh", "-c", "if [ \"$MODE\" = 'test' ]; then cd tests && pytest; else python main. py server_cpp 42069; fi"]