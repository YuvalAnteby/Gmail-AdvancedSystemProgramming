# Author: Dor Darmon
import sys
import os

from client_python.client_app import ClientApp

sys.path.insert(0,os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

#Run the main class for client
def main():
    if len(sys.argv) !=3:
        sys.exit(1)
    
    #Take the ip and port from command-arg
    ip =sys.argv[1]
    port = int(sys.argv[2])
    #start the client app and connect to the server
    app = ClientApp(ip, port)
    app.run()

if __name__== "__main__":
    main 