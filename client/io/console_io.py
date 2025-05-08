#ConsoleIO provides methods to read user input and print output to the screen.

class ConsoleIO:    
    def read_input(self) -> str:
        #Read a line of input from the user.        
        return input()    
    
    def print_output(self, response: str):
     #Print the server's response to the user.
     print(response, end="") 