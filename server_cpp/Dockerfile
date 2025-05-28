# This dockerfile is for solely running the project itself - not for tests
# author: Yuval Anteby

# Use the official GCC image from Docker
FROM gcc:latest
# Add CMake to the container
RUN apt-get update && apt-get install -y cmake
# Copy and set the project in the container
WORKDIR /usr/src/run_server
COPY . .
# Ensures a clean build folder
RUN rm -rf build && mkdir build
WORKDIR /usr/src/run_server/build

# Compile the CPP project, add more files and flags as needed
RUN cmake .. && make

RUN ls -lR .
# Run the compiled project
CMD ["./run_server", "12347", "8", "1", "2"]