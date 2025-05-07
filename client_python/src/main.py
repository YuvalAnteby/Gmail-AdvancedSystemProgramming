# Author: Dor Darmon
import socket
import os
import sys


# Manages TCP connection to the server
class ClientConnection:
    def __init__(self, ip: str, port: int):
        self.ip = ip
        self.port = port
        self.sock = None

    # Connect to the server once at startup
    def connect(self) -> bool:
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.connect((self.ip, self.port))
            return True
        except Exception as e:
            return False

    # Send a command to the server
    def send(self, message: str) -> None:
        self.sock.sendall((message + '\n').encode())

    # Receive the full response from the server (ends with '\n')
    def receive(self) -> str | None:
        response = b''
        while not response.endswith(b'\n'):
            chunk = self.sock.recv(1024)
            if not chunk:
                return None
            response += chunk
        return response.decode().strip()

    # Close the socket connection
    def close(self) -> None:
        if self.sock:
            self.sock.close()


# Handles the main interaction loop: input -> send -> receive -> print
class ClientApp:
    def __init__(self, connection: ClientConnection):
        self.connection = connection

    # Infinite loop: read input, send to server, wait for reply, print it
    def run(self) -> None:
        try:
            while True:
                try:
                    user_input = input()
                    self.connection.send(user_input)
                    response = self.connection.receive()
                    if response is None:
                        break
                    print(response)
                except EOFError:
                    break
        finally:
            self.connection.close()


# Gats IP and port from command line args
def get_server_details() -> tuple[str, int] | None:
   if len(sys.argv) == 3:
        return sys.argv[1], int(sys.argv[2])
   ip = os.getenv("SERVER_HOST")
   port_str = os.getenv("SERVER_PORT")
   if not ip or not port_str:
       return None
   try:
       return ip, int(port_str)
   except ValueError:
       return None


# Entry point
def main() -> None:
   details = get_server_details()
   if not details:
        return
   ip, port = details
   connection = ClientConnection(ip, port)
   if not connection.connect():
        return
   app = ClientApp(connection)
   app.run()

if __name__ == "__main__":
    main()