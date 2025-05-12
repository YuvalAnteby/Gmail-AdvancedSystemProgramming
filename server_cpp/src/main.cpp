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

    // Validate the input arguments
    // If validation fails return
    if (!isValidArgs(argc, argv)) {
        return 1;
    }
    // Process the input using (you will call the relevant method here)
    // This is where you can process the arguments (port, bloomSize, configInts)
    processInput(argc, argv, port, bloomSize, configInts);
    TCPSocketServer server(port);
    if (!server.acceptNewClient()) {
        std::cerr << "Failed to accept new client" << std::endl;
        return 1;
    }
    std::cout << "Accepted new client" << std::endl;
    // Initialize IO and persistence components.
    // Note: TcpInputReader and TCPOutputWriter are assumed to use the given port.
    IDataPersistence *dataSource = new FilePersistence();
    IInputReader *inputReader = new TCPInputReader(server.getClientSocket());
    IOutputWriter *outputWriter = new TCPOutputWriter(server.getClientSocket());

    // Main loop: listen for commands from the client, process, respond.
    while (true) {
        std::string line = inputReader->readLine();

        // If empty, client probably disconnected
        if (line.empty()) {
            std::cout << "[Server] Client disconnected. Waiting for new client..." << std::endl;

            // Clean up old IO handlers
            delete inputReader;
            delete outputWriter;

            // Accept a new client
            if (!server.acceptNewClient()) {
                std::cerr << "Failed to accept new client" << std::endl;
                continue; // Try again on next loop
            }
            std::cout << "Accepted new client" << std::endl;

            // Reinitialize IO components
            inputReader = new TCPInputReader(server.getClientSocket());
            outputWriter = new TCPOutputWriter(server.getClientSocket());
            continue; // Wait for input from new client
        }

        // Parse and process
        const CommandRequest cr = CommandParser::parseCommand(line);
        handleBloomCommandChoice(bloomSize, configInts, cr, *dataSource, *outputWriter);
    }

}
