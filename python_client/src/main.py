# Author: Dor Darmon
import sys
import socket

# Run the main class for client
# We need at least 3 args (initial element, server's ip, port)
if len(sys.argv) < 3:
    sys.exit(1)
# Take the ip and port from command-arg
ip = sys.argv[1]
port = int(sys.argv[2])
# Connect using TCP to the server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((ip, port))
# Get the first input to send to the server and loop until disconnecting
message = input()
while not message == 'close_client':
    s.send(bytes(message, "utf-8"))
    response = s.recv(4096)
    print(response.decode("utf-8"))
    message = input()
s.close()

