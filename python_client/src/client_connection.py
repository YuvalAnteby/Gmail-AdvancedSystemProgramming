# Author: Dor Darmon

import socket

#Handles the TCP connection to the server
class ClientConnection:
    def __init__(self, server_ip, server_port):
        
        #Initializes with the IP address and port of the server.
        self.server_ip = server_ip
        self.server_port = server_port
        self.socket = None
    
    #Initiates a TCP connection with the server.
    def establish_connection(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((self.server_ip, self.server_port))
    
    #Dispatches a data transmission to the server.
    def transmit(self, data: str):
        self.socket.sendall(data.encode())

    #Collects the server's reply.
    def retrieve(self) -> str:
        self.socket.settimeout(2)
        reply = b""
        try:
            while True:
                segment = self.socket.recv(1024)
                if not segment:
                    reply += segment
                    if b"\n" in segment:
                        break
        except socket.timeout:
            pass 
        return reply.decode()

