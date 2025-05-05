// Author(s): Dor Darmon, Yuval Anteby


#include "strategyIO/ConsoleInputReader.h"
#include "strategyIO/ConsoleOutputWriter.h"
#include "utils/InputValidation.h"
#include "utils/BloomInputProccesor.h"
#include "data_persistence/IDataPersistence.h"
#include "data_persistence/FilePersistence.h"
#include "strategyIO/IInputReader.h"
#include "strategyIO/IOutputWriter.h"
#include "bloom/utils/CommandParser.h"
#include "bloom/utils/CommandRequest.h"


/**
 * Main loop that reads and processes input lines.
 */
int main() {
    /// TODO need to get first int and config ints from command line arguments. get, validate, move to variables
    bool firstLineFlag = true; // true if we're waiting for first line input
    int firstInt = -1;
    std::vector<int> configInts;
    // Create the data persistence object according to data source (this time we use files)
    IDataPersistence *dataSource = new FilePersistence();
    /// TODO make the IO dynamic with TCP socket/ console etc
    // Create the dynamic IO
    IInputReader *inputReader = new ConsoleInputReader();
    IOutputWriter *outputWriter = new ConsoleOutputWriter();
    /// TODO check if there's a way to exit the infinite loop using terminal, old way of control+d doesnt work now
    // start the infinite loop
    while (true) {
        std::string line = inputReader->readLine();
        /// TODO change to get input of first line from CLI arguments
        // Skip to next line if the first line was invalid
        if (firstLineFlag && !containsOnlyDigitsAndWhitespace(line) && !isValidFirstLine(line)) {
            continue;
        }
        /// TODO remove this if block, won't be in use when using CLI arguments
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
        /// TODO remove this if block, won't be in use when using CLI arguments
        // If still waiting for first line or line isn't valid command - skip it
        if (firstLineFlag /*|| !hasValidCommandStructure(line)*/) {
            continue;
        }
        // handle the user's command choice
        const CommandRequest cr = CommandParser::parseCommand(line);
        handleBloomCommandChoice(firstInt, configInts, cr, *dataSource, *outputWriter);
    }
    delete dataSource;
    return 0;
}
