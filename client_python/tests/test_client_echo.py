# Author: Dor Darmon

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
output, _ = client_proc.communicate(input=input_text + "\n", timeout=5)

# Shut down echo server
echo_server.terminate()

# Check that the output contains the message we sent
if input_text in output:
    print("Echo test passed.")
else:
    print("Echo test failed.")


# test_client_variants.py
# This test runs multiple client input scenarios to ensure
# the client can handle basic ASCII communication.

def run_client_input(user_input: str) -> str:
    proc = subprocess.Popen(
        ["python", "client_python/main.py", "localhost", "42069"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    try:
        output, _ = proc.communicate(input=user_input + "\n", timeout=5)
        return output
    except subprocess.TimeoutExpired:
        proc.kill()
        return "TIMEOUT"

echo_server = subprocess.Popen(["python", "client_python/tests/echo_server.py"])
time.sleep(1)

tests = {
    "Empty": "",
    "Short": "HELLO",
    "Long": "A" * 100,
    "Multi-line": "FIRST\nSECOND"
}

for label, test_input in tests.items():
    print(f"Test: {label}")
    result = run_client_input(test_input)
    expected = test_input.split("\n")[0]
    passed = expected in result
    print("Result:", result.strip())
    print("Passed" if passed else "Failed")
    print()

echo_server.terminate()


# === test_client_edge_cases.py ===
# This test sends special characters, symbols, and foreign text
# to check whether the client handles UTF-8 correctly.

echo_server = subprocess.Popen(["python", "client_python/tests/echo_server.py"])
time.sleep(1)

edge_cases = {
    "Symbols": "!@#$%^&*()_+=<>",
    "Mixed Text": "hello#123!",
    "Hebrew": "שלום",
    "Arabic": "مرحبا",
    "Chinese": "你好",
}

for name, test_input in edge_cases.items():
    print(f"Edge Case: {name}")
    result = run_client_input(test_input)
    print("Input:", test_input)
    print("Output:", result.strip())
    print("Passed" if test_input in result else "Failed")
    print()

echo_server.terminate()


# === test_client_protocol.py ===
# This test simulates a real protocol session with the server.
# It checks that commands like POST, GET, DELETE behave as specified.

def run_command_sequence(commands):
    proc = subprocess.Popen(
        ["python", "client_python/main.py", "localhost", "42069"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    joined = "\n".join(commands) + "\n"
    try:
        output, _ = proc.communicate(input=joined, timeout=5)
        return output.strip().splitlines()
    except subprocess.TimeoutExpired:
        proc.kill()
        return ["TIMEOUT"]

sequence = [
    "10 2 3",
    "POST http://google.com",
    "GET http://google.com",
    "DELETE http://google.com",
    "DELETE http://not-added.com",
    "RANDOM bad input"
]

expected = [
    "201 Created",
    "200 Ok",
    "204 No Content",
    "404 Not Found",
    "400 Bad Request"
]

print("Running protocol tests")
lines = run_command_sequence(sequence)

matches = 0
for line in lines:
    for exp in expected:
        if line.startswith(exp):
            print("Match:", line)
            matches += 1
            break
    else:
        print("Unexpected:", line)

print(f"Passed {matches}/{len(expected)} expected response matches.")
