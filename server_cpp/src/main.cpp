#include <iostream>
#include <vector>
#include <string>
#include "utils/InputValidation.h"
#include "strategyIO/TcpInputReader.h"
#include "strategyIO/TCPOutputWriter.h"
#include "data_persistence/IDataPersistence.h"
#include "data_persistence/FilePersistence.h"
#include "strategyIO/IInputReader.h"
#include "strategyIO/IOutputWriter.h"
#include "bloom/utils/CommandParser.h"
#include "bloom/utils/CommandRequest.h"

int main(int argc, char* argv[]) {
    // Declaring variables to store port, bloom filter size, and hash mod values
    int port;
    int bloomSize;
    std::vector<int> configInts;

    // Validate the input arguments
    // If validation fails return
     if (!validateAndParseArgs(argc, argv)) {
        return 1; 
    }
    // Process the input using (you will call the relevant method here)
    // This is where you can process the arguments (port, bloomSize, configInts)
   processInput(argc, argv, port, bloomSize, configInts);




    // Initialize IO and persistence components.
    // Note: TcpInputReader and TCPOutputWriter are assumed to use the given port.
    IDataPersistence* dataSource = new FilePersistence();
    IInputReader* inputReader = new TcpInputReader(port);
    IOutputWriter* outputWriter = new TCPOutputWriter(port);

    std::cout << "Server is running on port " << port << "...\n";//TODO: do not print just for checking

    // Main loop: listen for commands from the client, process, respond.
    while (true) {
        std::string line = inputReader->readLine();
        }

        // Parse and process the command using existing Bloom Filter logic.
        const CommandRequest cr = CommandParser::parseCommand(line);
        handleBloomCommandChoice(bloomSize, configInts, cr, *dataSource, *outputWriter);

    //    // Exit mechanism — could be replaced with admin-only command later.
      //  if (cr.getCommandName() == "exit") {
        //    break;
       // }
    }

    //  delete allocated resources.
    //TODO: i am not sure we need to delete that
    delete inputReader;
    delete outputWriter;
    delete dataSource;

    return 0;
}