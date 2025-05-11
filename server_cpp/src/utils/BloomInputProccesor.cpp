// @Author(s): Yuval Anteby
#include <iostream>
#include <sstream>
#include <vector>
#include <bloom/commands/DeleteUrlCommand.h>
#include <bloom/utils/BloomFilterStatusCodeParser.h>
#include <bloom/utils/CommandRequest.h>

#include "data_persistence/IDataPersistence.h"
#include "bloom/commands/InsertUrlCommand.h"
#include "bloom/commands/CheckUrlCommand.h"
#include "bloom/commands/BloomCommandInvoker.h"


/**
 * Process the input arguments passed to the program.
 * This function extracts the port, bloom filter size, and hash mods from the provided arguments (argv).
 * The values are then assigned to the references port, bloomSize, and hashMods.
 * @param argc number of command-line arguments.
 * @param argv array of command-line arguments.
 * @param port reference to an integer where the port value will be stored.
 * @param bloomSize reference to an integer where the bloom size will be stored.
 * @param hashMods reference to a vector where the hash mod values will be stored.
 */
void processInput(int argc, char *argv[], int &port, int &bloomSize, std::vector<int> &hashMods) {
    // Get the port
    std::string portStr(argv[1]);
    port = std::stoi(portStr);
    // Get the bit array size
    std::string bloomSizeStr(argv[2]);
    bloomSize = std::stoi(bloomSizeStr);
    // Get the rest of the numbers (config ints for the hash)
    for (int i = 3; i < argc; ++i) {
        int mod = std::stoi(argv[i]);
        hashMods.push_back(mod);
    }
}

/**
 * Get the first number from the first line as a string, edit the line string to skip it.
 * @param line string of the user's input line. will be changed in function
 * @return string of the first number in the string (bit array size)
 */
std::string processFirstInt(std::string &line) {
    std::string numString = "";
    int i = 0; // save counter to know the number's length (including the whitespace)
    // Extract digits at the beginning
    while (i < line.length() && std::isdigit(line[i])) {
        numString.push_back(line[i]);
        ++i;
    }
    // Skip whitespaces after the number
    while (i < line.length() && std::isspace(line[i])) {
        ++i;
    }
    // Edit the line string
    line = line.substr(i);

    return numString;
}

/**
 * Get the remaning ints from the user's first line of input, which contains ints only
 * @param newLine the line after removing the first int
 * @return vector of ints representing the ints from the user
 */
std::vector<int> processConfigInts(const std::string &newLine) {
    std::vector<int> result;
    std::istringstream iss(newLine);
    int num;
    // insert the numbers to the vector
    while (iss >> num) {
        result.push_back(num);
    }
    return result;
}

/**
 * Handle the user's choice of bloom filter command, initialize and execute the correct one, if given valid input.
 * @param arrSize bit array size given by the user
 * @param configInts the rest of the config integers for the hashing
 * @param commandReq object of a commands request, made of {command enum, string URL}
 * @param dataSource object of the data source to provide URLs, bits etc
 * @param outputWriter object responsible on output (e.g. output using a CLI or over a TCP socket)
 */
void handleBloomCommandChoice(
        int arrSize,
        const std::vector<int> &configInts,
        CommandRequest commandReq,
        IDataPersistence &dataSource,
        IOutputWriter &outputWriter
) {
    // Create the invoker for the commands
    BloomCommandInvoker invoker;
    switch (commandReq.getCommand()) {
        case POST: {
            InsertUrlCommand insertUrlCommand(commandReq.getUrl(), dataSource, configInts, arrSize, outputWriter);
            invoker.runCommand(insertUrlCommand);
            // Print the result using the dynamic writer
            std::string msg = insertUrlCommand.getResult().getFullMessage();
            outputWriter.writeData(msg);
            break;
        }
        case GET: {
            CheckUrlCommand checkUrlCommand(commandReq.getUrl(), dataSource, configInts, arrSize, outputWriter);
            invoker.runCommand(checkUrlCommand);
            // Print the result using the dynamic writer
            std::string msg = checkUrlCommand.getResult().getFullMessage();
            outputWriter.writeData(msg);
            break;
        }
        case DELETE: {
            // Initialize & execute
            DeleteUrlCommand deleteUrlCommand(commandReq.getUrl(), dataSource, outputWriter);
            invoker.runCommand(deleteUrlCommand);
            // Print the outcome using the dynamic writer
            std::string msg = deleteUrlCommand.getResult().getFullMessage();
            outputWriter.writeData(msg);
            break;
        }
        default: {
            std::string errorMsg = toStatusMessage(BAD_REQUEST);
            outputWriter.writeData(errorMsg);
        }
    }
}