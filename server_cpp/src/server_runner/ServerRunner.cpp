#include "ServerRunner.h"
#include "../network/TCPSocketServer.h"
#include <pthread.h>
#include "../strategy_io/IInputReader.h"
#include "../strategy_io/IOutputWriter.h"
#include "../strategy_io/tcp/TCPInputReader.h"
#include "../strategy_io/tcp/TCPOutputWriter.h"
#include "../bloom/utils/command_code/CommandParser.h"
#include "../bloom/commands/utils/CommandRequest.h"
#include "../strategy_io/utils/BloomInputProccesor.h"

struct ArgsThread {
    int clientSock;               // Client socket descriptor
    int bloomSize;                // Size of the Bloom filter
    std::vector<int> configInts;  // Bloom filter configuration values
    IDataPersistence* dataSource; // Shared data store
    std::mutex* dataMutex;        // Mutex protecting dataSource
};

/**
 * Handles communication with a connected client in a separate thread.
 * Reads commands from the client socket, parses them, and processes Bloom filter operations.
 * Ensures thread-safe access to the shared data store via a mutex.
 * Cleans up all resources when the client disconnects or an error occurs.
 * @param voidArgs Pointer to ArgsThread containing thread arguments:
 * clientSock: socket for this client
 * bloomSize: size of the Bloom filter
 * configInts: vector of Bloom filter configuration values
 * dataSource: pointer to shared data persistence object
 * dataMutex: pointer to mutex protecting dataSource
 * @return nullptr
 */
void* handleThread(void* voidArgs) {
    ArgsThread* args = static_cast<ArgsThread*>(voidArgs);
    // Create input reader to read lines from the client socket
    IInputReader* inputReader = new TCPInputReader(args->clientSock);
    // Create output writer to send responses to the client socket
    IOutputWriter* outputWriter = new TCPOutputWriter(args->clientSock);

    while (true) {
        std::string line = inputReader->readLine();
        if (line.empty()) break; //client disconnect or read error

        // Parse the incoming command string into a CommandRequest object
        CommandRequest cr = CommandParser::parseCommand(line);

        // Process the Bloom filter command in a thread-safe manner
        {
            std::lock_guard<std::mutex> lock(*(args->dataMutex)); // Lock shared data
            handleBloomCommandChoice(
                args->bloomSize,
                args->configInts,
                cr,
                *(args->dataSource),
                *outputWriter
            );
        }
    }

    // Clean up resources after client disconnects
    delete inputReader;   // Delete the TCP input reader
    delete outputWriter;  // Delete the TCP output writer
    delete args;          // Free the thread arguments
    pthread_exit(nullptr);
    return nullptr;
}

/**
 * Starts the TCP server, listens on the specified port, and dispatches each new client
 * connection to a detached thread running handleThread().
 * The server runs indefinitely until the process is terminated.
 *
 * @param port        TCP port number on which the server listens for connections
 * @param bloomSize   Size of the Bloom filter to be used by each thread
 * @param configInts  Vector of configuration integers for the Bloom filter
 * @param dataSource  Pointer to shared data persistence object (e.g., database or in-memory store)
 * @param dataMutex   Pointer to mutex that synchronizes access to dataSource
 * @return EXIT_SUCCESS on normal termination (server loop runs continuously)
 */
int runServer(
    int port,
    int bloomSize,
    const std::vector<int>& configInts,
    IDataPersistence* dataSource,
    std::mutex* dataMutex
) {
    // Initialize and start listening on the given TCP port
    TCPSocketServer server(port);

    // wait for and accept new client connections
    while (server.acceptNewClient()) {
        int clientSock = server.getClientSocket(); // Obtain the client socket descriptor

        // Allocate thread and arguments for the new client
        ArgsThread* args = new ArgsThread;
        args->clientSock = clientSock;
        args->bloomSize = bloomSize;
        args->configInts = configInts;
        args->dataSource = dataSource;
        args->dataMutex = dataMutex;

        pthread_t threadId;
        // Create a new detached thread to handle this client
        if (pthread_create(&threadId, nullptr, handleThread, args) == 0) {
            pthread_detach(threadId); // Detach the thread so it cleans up automatically
        } else {
            // If thread creation fails, free the allocated arguments
            delete args;
        }
    }
    return EXIT_SUCCESS;
}
