// Author(s): Dor Darmon, Yuval Anteby
#include <iostream>
#include <sstream>
#include <bloom/commands/BloomCommandInvoker.h>
#include <bloom/commands/CheckUrlCommand.h>
#include <bloom/commands/InsertUrlCommand.h>
#include <strategyIO/ConsoleInputReader.h>
#include <strategyIO/ConsoleOutputWriter.h>

#include "utils/InputValidation.h"
#include "utils/BloomInputProccesor.h"
#include "data_persistence/IDataPersistence.h"
#include "data_persistence/FilePersistence.h"
#include "strategyIO/IInputReader.h"
#include "strategyIO/IOutputWriter.h"
#include "bloom/utils/CommandParser.h"
#include "bloom/utils/CommandRequest.h"

void handleChoice(
    int arrSize,
    const std::vector<int> &configInts,
    CommandRequest commandReq,
    IDataPersistence& dataSource,
    IOutputWriter& outputWriter
    ) {
    // Create the invoker for the commands
    BloomCommandInvoker invoker;
    switch (commandReq.getCommand()) {
        case POST:
            InsertUrlCommand insertUrlCommand(commandReq.getUrl(), dataSource, configInts, arrSize, outputWriter);//TODO add output
        case GET:
            CheckUrlCommand checkUrlCommand(commandReq.getUrl(), dataSource, configInts, arrSize, outputWriter);
        case DELETE:
            std::cout << "DELETE FUNC HERE " << std::endl;
        invoker.runCommand(checkUrlCommand);
        case default:
            std::cout << "SOME ERROR" << std::endl; // TODO switch to real error handling
    }
}

/**
 * Main loop that reads and processes input lines.
 */
int main() {
    std::string line;
    bool firstLineFlag = true; // true if we're waiting for first line input
    int firstInt;
    std::vector<int> configInts;
    // Create the data persistence object according to data source (this time we use files)
    IDataPersistence *dataSource = new FilePersistence();
    // Create the dynamic IO
    IInputReader *inputReader = new ConsoleInputReader();
    IOutputWriter *outputWriter = new ConsoleOutputWriter();
    // start the infinite loop
    while (true) {
        // TODO change to get input of first line from CLI arguments
        // Skip to next line if the first line was invalid
        if (firstLineFlag && !containsOnlyDigitsAndWhitespace(line) && !isValidFirstLine(line)) {
            continue;
        }
        // processing first line of config ints
        if (firstLineFlag) {
            // Get the first line's ints, put the first int (bit array size) int one variable
            firstInt = stoi(processFirstInt(line));
            // Get the rest of the config ints in a vector
            configInts = processConfigInts(line);
            // Check if the given config ints are matching the ones we saved already, save them if needed.
            if (!isConfigMatching(firstInt, configInts, *dataSource)) {
                continue;
            }
        }
        // Update the first line flag
        firstLineFlag = false;
        // If still waiting for first line or line isn't valid command - skip it
        if (firstLineFlag || !hasValidCommandStructure(line)) {
            continue;
        }
        // handle the user's command choice
        CommandRequest cr = CommandParser::parseCommand(line);
        handleChoice(firstInt, configInts, cr, *dataSource, *outputWriter);
        handleUserChoice(line, firstInt, configInts, *dataSource);
    }
    delete dataSource;
    return 0;
}


