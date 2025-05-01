import sys


def main():
    if len(sys.argv) < 3:
        print("No input from docker")
    else:
        print("server: ", sys.argv[1])
        print("port number: ", sys.argv[2])
    # User input just for the sake of checking if user input works in the docker container run
    user_input = input("")
    print("user input: ", user_input)


if __name__ == "__main__":
    main()