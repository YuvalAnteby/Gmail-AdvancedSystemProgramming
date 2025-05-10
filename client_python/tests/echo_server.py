
#Echo server used for testing the client.
#Listens on a TCP port and echoes back messages.
#Supports clean shutdown with "STOP" command.

#Author: Dor Darmon

import socket
import threading
# Global flag to allow graceful shutdown
should_run = True  

def handle_client(conn, addr):
    """
    Handles an individual client connection.
    Echoes received data, exits if "STOP" is received.
    """
    global should_run
    with conn:
        try:
            while should_run:
                data = conn.recv(1024)
                if not data:
                    break
                decoded = data.decode().strip()
                if decoded == "STOP":
                    should_run = False
                    break
                conn.sendall(data)
        except ConnectionResetError:
            pass  # Client disconnected abruptly

def run_echo_server(host="127.0.0.1", port=42069):
    """
    Starts the echo server and accepts incoming connections.
    """
    global should_run
    should_run = True  # Reset flag in case re-run
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((host, port))
    server.listen()
    print(f"[Echo Server] Listening on {host}:{port}")

    try:
        while should_run:
            conn, addr = server.accept()
            thread = threading.Thread(target=handle_client, args=(conn, addr), daemon=True)
            thread.start()
    except KeyboardInterrupt:
        print("[Echo Server] Shutting down.")
    finally:
        server.close()

if __name__ == "__main__":
    run_echo_server()

