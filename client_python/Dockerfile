# This dockerfile is for solely running the client itself - not for tests
# Author: dor darmon 

# Pick the python version
FROM python:3.11-slim
# Copy and set the client in the container
WORKDIR /app/src
COPY . /app
# Default command depending on the mode:
#Take ARG in build AND runtime for more flexible container behaviour
CMD ["python", "src/main.py","app","42069"]