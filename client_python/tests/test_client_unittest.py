# Author: Dor Darmon

import unittest
import socket
import subprocess
import time
import os


class TestEchoServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        
        #Starts the echo server before running the tests.
        echo_path = os.path.join(os.path.dirname(__file__), "echo_server.py")
        cls.server_proc = subprocess.Popen(["python", echo_path])
        time.sleep(1)  # Give the server time to start

    @classmethod
    def tearDownClass(cls):
        
        #Stops the echo server after all tests are done.
        try:
            with socket.create_connection(("127.0.0.1", 42069), timeout=2) as s:
                s.sendall(b"STOP\n")  # Shutdown command
        except Exception as e:
            print("⚠️ Could not stop server:", e)

        cls.server_proc.terminate()
        cls.server_proc.wait()

    def send_and_receive(self, message: str) -> str:
        #Sends a message to the echo server and returns the response.
        # Args: message (str): The message to send.
        # Returns: str: The response received from the server
        with socket.create_connection(("127.0.0.1", 42069), timeout=2) as s:
            s.sendall((message + "\n").encode())
            response = s.recv(2048).decode().strip()
            return response

    def test_echo_response(self):

        # Basic echo test with a standard message.
        msg = "hello echo test"
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)

    def test_special_characters(self):

        # Sends a string with special characters and checks the echo.
        msg = "!@#$%^&*()_+=~<>?,./;'[]\\{}|`"
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)

    def test_empty_input(self):
        
        # Sends an empty string and expects an empty string in return.
        msg = ""
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)

    def test_long_input(self):
        
        # Sends a long message (1000 characters) and expects the same string in return.
        msg = "A" * 1000
        response = self.send_and_receive(msg)
        self.assertEqual(response, msg)

    def test_connection_drop(self):
        
        # Connects to the server and disconnects without sending anything.
        # Ensures the server does not crash.
        try:
            s = socket.create_connection(("127.0.0.1", 42069), timeout=2)
            s.close()
        except Exception as e:
            self.fail(f"Connection drop test failed with exception: {e}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
