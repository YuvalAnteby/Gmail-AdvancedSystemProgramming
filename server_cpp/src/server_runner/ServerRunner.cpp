#include "ServerRunner.h"
#include "../network/TCPSocketServer.h"
#include <pthread.h>
#include <memory>
#include "../strategy_io/IInputReader.h"
#include "../strategy_io/IOutputWriter.h"
#include "../strategy_io/tcp/TCPInputReader.h"
#include "../strategy_io/tcp/TCPOutputWriter.h"
#include "../bloom/utils/command_code/CommandParser.h"
#include "../bloom/commands/utils/CommandRequest.h"
#include "../strategy_io/utils/BloomInputProccesor.h"

struct ArgsThread {
    int clientSock;            // client socket descriptor
    int bloomSize;             // size of bloom filter
    std::vector<int> configInts; // bloom config values
    IDataPersistence* dataSource; // shared data store
    std::mutex* dataMutex;     // protects dataSource
};

void* handleThread(void* voidArgs) {
    ArgsThread* args = static_cast<ArgsThread*>(voidArgs);
    IInputReader* inputReader = new TCPInputReader(args->clientSock);  // read from socket
    IOutputWriter* outputWriter = new TCPOutputWriter(args->clientSock); // write to socket

    while (true) {
        std::string line = inputReader->readLine();
        if (line.empty()) break; // exit on disconnect or error

        CommandRequest cr = CommandParser::parseCommand(line); // parse incoming command

        // process command with thread safety
        {
            std::lock_guard<std::mutex> lock(*(args->dataMutex)); // lock shared data
            handleBloomCommandChoice(
                    args->bloomSize,
                    args->configInts,
                    cr,
                    *(args->dataSource),
                    *outputWriter
            );
        }
    }

    delete inputReader;  // clean up reader
    delete outputWriter; // clean up writer
    delete args;        // free thread arguments
    pthread_exit(nullptr);
    return nullptr;
}

int runServer(
        int port,
        int bloomSize,
        const std::vector<int>& configInts,
        IDataPersistence* dataSource,
        std::mutex* dataMutex
) {
    TCPSocketServer server(port); // start listening on port

    while (server.acceptNewClient()) {
        int clientSock = server.getClientSocket(); // new client socket
        ArgsThread* args = new ArgsThread;
        args->clientSock = clientSock;
        args->bloomSize = bloomSize;
        args->configInts = configInts;
        args->dataSource = dataSource;
        args->dataMutex = dataMutex;

        pthread_t threadId;
        if (pthread_create(&threadId, nullptr, handleThread, args) == 0) {
            pthread_detach(threadId); // detach thread
        } else {
            delete args; // free args if thread fails
        }
    }
    return EXIT_SUCCESS;
}
