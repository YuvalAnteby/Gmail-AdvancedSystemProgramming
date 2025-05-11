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
    } else {
        std::cout << "Accepted new client" << std::endl;
    }
    // Initialize IO and persistence components.
    // Note: TcpInputReader and TCPOutputWriter are assumed to use the given port.
    IDataPersistence *dataSource = new FilePersistence();
    IInputReader *inputReader = new TCPInputReader(server.getClientSocket());
    IOutputWriter *outputWriter = new TCPOutputWriter(server.getClientSocket());
    bool shouldProcessInput = true;
    // Main loop: listen for commands from the client, process, respond.
    while (true) {
        if (shouldProcessInput) {
            std::string line = inputReader->readLine();
            shouldProcessInput = false;
            // Parse and process the command using existing Bloom Filter logic.
            const CommandRequest cr = CommandParser::parseCommand(line);
            handleBloomCommandChoice(bloomSize, configInts, cr, *dataSource, *outputWriter);
            shouldProcessInput = true;
        }
    }

    //    // Exit mechanism — could be replaced with admin-only command later.
    //  if (cr.getCommandName() == "exit") {
    //    break;
    // }


    //delete allocated resources.
    delete inputReader;
    delete outputWriter;
    delete dataSource;
    return 0;
}