import socket
import threading
import time

# Import your echo server function
from echo_server import run_echo_server

def start_echo_server_in_thread():
    """
    Starts the echo server in a separate thread.
    """
    server_thread = threading.Thread(target=run_echo_server, daemon=True)
    server_thread.start()
    time.sleep(0.5)  # Give the server time to start
    return server_thread

def test_echo_server_basic():
    start_echo_server_in_thread()

    HOST = '127.0.0.1'
    PORT = 42069
    message = "ECHO_TEST_INPUT\n"

    with socket.create_connection((HOST, PORT), timeout=5) as sock:
        sock.sendall(message.encode())
        response = sock.recv(1024).decode().strip()

    assert message.strip() == response, f"Expected '{message.strip()}', got '{response}'"
