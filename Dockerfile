# Use the official GCC image from Docker
FROM gcc:latest
# Copy and set the project in the container
COPY . .
WORKDIR /usr/src/app
# Compile the CPP project, add more files and flags as needed
RUN g++ -o app main.cpp
# Run the compiled project
CMD ["./app"]