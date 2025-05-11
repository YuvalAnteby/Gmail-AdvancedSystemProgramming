# Author: Dor Darmon
import sys
import os
 
sys.path.insert(0,os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from client_python.client_connection import ClientConnection
from client_python.console_io import ConsoleIO

#ClientApp ties together the user interface and the network communication.
class ClientApp:
    def __init__(self, server_ip, server_port):
        
        #Initialize the app with a network connection and console I/O.
        self.connection = ClientConnection(server_ip, server_port)
        self.io = ConsoleIO()

    def run(self):
        
        #Run the main clinet loop: connect, read input, send it , response.
        self.connection.connect()
        while True:
            user_input = self.io.read_input()
            self.connection.send(user_input)
            response = self.connection.receive()
            self.io.print_output(response)

