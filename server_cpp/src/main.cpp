#include <iostream>
#include <vector>
#include <string>
#include <network/TCPSocketServer.h>

#include "utils/InputValidation.h"
#include "strategyIO/TCPInputReader.h"
#include "strategyIO/TCPOutputWriter.h"
#include "data_persistence/IDataPersistence.h"
#include "data_persistence/FilePersistence.h"
#include "strategyIO/IInputReader.h"
#include "strategyIO/IOutputWriter.h"
#include "bloom/utils/CommandParser.h"
#include "bloom/utils/CommandRequest.h"
#include "utils/BloomInputProccesor.h"

int main(int argc, char *argv[]) {
    // Declaring variables to store port, bloom filter size, and hash mod values
    int port;
    int bloomSize;
    std::vector<int> configInts;

    // Validate the input arguments, if invalid exit the program
    if (!isValidArgs(argc, argv)) {
        return 1;
    }
    IDataPersistence *dataSource = new FilePersistence();
    // process the arguments (port, bloomSize, configInts) and saves them
    processInput(argc, argv, port, bloomSize, configInts, *dataSource);
    // Start the TCP server
    TCPSocketServer server(port);
    if (!server.acceptNewClient()) {
        return 1;
    }
    // Initialize IO and persistence components.
    IInputReader *inputReader = new TCPInputReader(server.getClientSocket());
    IOutputWriter *outputWriter = new TCPOutputWriter(server.getClientSocket());
    // Main loop: listen for commands from the client, process, respond.
    while (true) {
        std::string line = inputReader->readLine();
        // If empty, client probably disconnected
        if (line.empty()) {
            // Clean up old IO handlers
            delete inputReader;
            delete outputWriter;
            // Accept a new client
            if (!server.acceptNewClient()) {
                continue; // Try again on next loop
            }
            // Reinitialize IO components
            inputReader = new TCPInputReader(server.getClientSocket());
            outputWriter = new TCPOutputWriter(server.getClientSocket());
            continue; // Wait for input from new client
        }
        // Parse and process
        const CommandRequest cr = CommandParser::parseCommand(line);
        handleBloomCommandChoice(bloomSize, configInts, cr, *dataSource, *outputWriter);
    }
    return 0;
}
