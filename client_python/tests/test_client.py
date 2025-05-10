"""
pytest-compatible test suite for the client app with echo server.
Author: Dor Darmon
"""

import subprocess
import time

def start_echo_server():
    server = subprocess.Popen(["python", "client_python/tests/echo_server.py"])
    time.sleep(1)
    return server

def stop_echo_server(server):
    server.terminate()
    server.wait()
    time.sleep(0.5)

def run_client_input(user_input: str) -> str:
    proc = subprocess.Popen(
        ["python", "client_python/src/main.py", "localhost", "42069"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    try:
        output, _ = proc.communicate(input=user_input + "\n", timeout=5)
        return output.strip()
    except subprocess.TimeoutExpired:
        proc.kill()
        return "TIMEOUT"

def run_command_sequence(commands):
    proc = subprocess.Popen(
        ["python", "client_python/src/main.py", "localhost", "42069"],
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

def test_echo():
    server = start_echo_server()
    result = run_client_input("ECHO_TEST_INPUT")
    stop_echo_server(server)
    assert "ECHO_TEST_INPUT" in result

def test_variants():
    tests = {
        "Empty": "",
        "Short": "HELLO",
        "Long": "A" * 100,
        "Multi-line": "FIRST\nSECOND"
    }
    server = start_echo_server()
    for label, test_input in tests.items():
        expected = test_input.split("\n")[0]
        result = run_client_input(test_input)
        assert expected in result, f"{label} failed. Output: {result}"
    stop_echo_server(server)

def test_edge_cases():
    edge_cases = {
        "Symbols": "!@#$%^&*()_+=<>",
        "Mixed Text": "hello#123!",
        "Hebrew": "שלום",
        "Arabic": "مرحبا",
        "Chinese": "你好"
    }
    server = start_echo_server()
    for name, test_input in edge_cases.items():
        result = run_client_input(test_input)
        assert test_input in result, f"{name} failed. Output: {result}"
    stop_echo_server(server)

def test_protocol_behavior():
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
    server = start_echo_server()
    lines = run_command_sequence(sequence)
    stop_echo_server(server)
    matches = sum(any(line.startswith(exp) for exp in expected) for line in lines)
    assert matches == len(expected), f"Expected {len(expected)} matches, got {matches}"
