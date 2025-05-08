import socket

class ClientConnection:
    def __init__(self, server_ip, server_port):
        #Initializes with the IP address and port of the server.
        self.server_ip = server_ip
        self.server_port = server_port
        self.socket = None
    
    def establish_connection(self):
        #Initiates a TCP connection with the server.
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((self.server_ip, self.server_port))
    
    def transmit(self, data: str):
        #Dispatches a data transmission to the server.
        self.socket.sendall(data.encode())
    
    def retrieve(self) -> str:
        #Collects the server's reply.
        reply = b""
        while True:
            segment = self.socket.recv(1024)
            reply += segment
            if b"\n" in segment:
                break
        return reply.decode()