
# Author: Dor Darmon
import unittest
import socket
import subprocess
import time
import os

# tests for the client use echo server to test edge case  
class TestEchoServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Set up the echo server before any test runs.This launches echo_server.py as a subprocess and waits 1 second for it to be ready.
        echo_path = os.path.join(os.path.dirname(__file__), "echo_server.py")
        cls.server_proc = subprocess.Popen(["python", echo_path])
        time.sleep(1) 

        # Allow time for the server to start listening
    @classmethod
    def tearDownClass(cls):
        
        # Clean up the echo server after all tests are completed.
        # Sends a 'STOP' message to shut down the server gracefully.
        # If it fails, forcibly terminates the process."""
        try:
            with socket.create_connection(("127.0.0.1", 42069), timeout=2) as s:
                s.sendall(b"STOP\n") 
                # Graceful shutdown signal
        except Exception as e:
            print("Could not stop server:", e)
            # Ensure the server process is stopped
            cls.server_proc.terminate() 
            cls.server_proc.wait() 

    def send_and_receive(self, message: str) -> str:
        
        # Helper method to connect to the server, send a message, and receive the response.
        # Args:message (str): The message to send to the server.
        # Returns:str: The response echoed back from the server, stripped of newline.
        with socket.create_connection(("127.0.0.1", 42069), timeout=2) as s:
            s.sendall((message + "\n").encode()) 
            # Send the message with newline
            response = s.recv(2048).decode().strip()
            # Read response and strip whitespace
            return response
        
    def test_echo_response(self):
        # Basic test: send a regular message and expect to receive it back unchanged.
        msg = "hello echo test"
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)
            
        
    def test_special_characters(self):
        # Test server behavior with a variety of special characters in the message."""
        msg = "!@#$%^&*()_+=~<>?,./;'[]\\{}|`"
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)
            
    def test_empty_input(self):
        
        # Test how the server handles an empty input message.Expect an empty response."""
        msg = ""
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)
        
    def test_long_input(self):
        
        # Send a long input string (1000 'A's) to ensure server handles large payloads."""
        msg = "A" * 1000
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)
    
    def test_connection_drop(self):
        
        # Simulate a client that connects and then disconnects without sending any data.
        # Test ensures that the server does not crash or throw errors in this case."""
        try:
            s = socket.create_connection(("127.0.0.1", 42069), timeout=2)
            s.close()
         
         # Close immediately without sending data
        except Exception as e:self.fail(f"Connection drop test failed with exception: {e}")

# Run all tests with increased verbosity (shows each test name and result)
if __name__ == "__main__":
    unittest.main(verbosity=2)