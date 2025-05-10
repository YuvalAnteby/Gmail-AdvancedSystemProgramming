# Author: Dor Darmon
import sys
import os

sys.path.insert(0,os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from core.client_app import ClientApp

#Run the main class for clinet 
def main():
    if len(sys.argv) !=3:
        sys.exit(1)
    
    #Take the ip and port from command-arg
    ip =sys.argv[1]
    port = int(sys.argv[2])
    #start the clinet app and commect to the server 
    app = ClientApp(ip, port)
    app.run()

if __name__== "__main__":
    main 