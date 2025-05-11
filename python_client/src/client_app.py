# Author: Dor Darmon
import sys
import os
 
sys.path.insert(0,os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from client_connection import ClientConnection
from console_io import ConsoleIO

#ClientApp ties together the user interface and the network communication.
class ClientApp:
    def __init__(self, server_ip, server_port):
        #Initialize the app with a network connection and console I/O.
        self.connection = ClientConnection(server_ip, server_port)
        self.io = ConsoleIO()

    def run(self):
        #Run the main client loop: connect, read input, send it , response.
        self.connection.establish_connection()
        user_input = self.io.read_input()
        while not user_input == 'quit_quit':
            print("sent info:", user_input)
            self.connection.socket.send(bytes(user_input, "utf-8"))
            response = self.connection.socket.recv(4096)
            msg = response.decode("utf-8")
            self.io.print_output(msg)
            print("got info: ", msg)
            user_input = self.io.read_input()
        self.connection.socket.close()