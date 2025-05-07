import os
import subprocess
import time

# This test checks whether the client correctly sends a message and
# receives the same message back from a simple echo server.

# Start a simple echo server in the background
echo_server = subprocess.Popen(["python", "client_python/tests/echo_server.py"])
time.sleep(1)

# Server connection settings
host = "localhost"
port = "42069"
input_text = "ECHO_TEST_INPUT"

# Start the client with the expected arguments and pass input
client_proc = subprocess.Popen(
    ["python", "client_python/main.py", host, port],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Send a single message and capture the response
output, _ = client_proc.communicate(input=input_text + "\\n", timeout=5)

# Shut down echo server
echo_server.terminate()

# Check that the output contains the message we sent
if input_text in output:
    print(" Echo test passed.")
else:
    print(" Echo test failed.")
