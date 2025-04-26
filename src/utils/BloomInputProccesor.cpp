// @Author(s): Yuval Anteby
#include <iostream>
#include <sstream>
#include <vector>
#include "data_persistence/IDataPersistence.h"
#include "data_persistence/FilePersistence.h"
#include "bloom/commands/InsertUrlCommand.h"
#include "bloom/commands/CheckUrlCommand.h"
#include "bloom/commands/BloomCommandInvoker.h"
#include "utils/InputValidation.h"

/**
 * Get the first number from the first line as a string, edit the line string to skip it.
 * @param line string of the user's input line. will be changed in function
 * @return string of the first number in the string (bit array size)
 */
std::string processFirstInt(std::string& line) {
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
std::vector<int> processConfigInts(const std::string& newLine) {
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
 * Process a valid command line (after the initial line of ints):
 * - If it starts with '1', add the URL
 * - If it starts with '2', check against the blacklist
 * @param line string of the user's choice of command & the url string
 */
void handleUserChoice(const std::string& line, int firstInt, const std::vector<int> configInts) {
    //std::cout << "----- DEBUG: handleUserChoice -----" << std::endl; // TODO: remove debug print
    // Make sure the line's length is more than 3 to access the URL
    if (line.size() < 3) {
        return;
    }
    // Extract URL after command and space
    std::string url = line.substr(2);  
    // If the URL is invalid print false
    if (!isValidURL(url)) {
        //std::cout << "false" << std::endl;
        return;
    }
    // Create the data persistence object according to data source (this time we use files)
    IDataPersistence* dataSource = new FilePersistence();
    // Create the invoker for the commands
    BloomCommandInvoker invoker;
    // TODO: add to commands' constructors the config ints vector and the bit array size int

    // Check what option the user chose, execute the correct command
    if (line[0] == '1') {
        //std::cout << "----- DEBUG: chosen 1 -----" << std::endl; // TODO: remove debug print
        InsertUrlCommand insertUrlCommand(url, *dataSource, configInts, firstInt);
        invoker.runCommand(insertUrlCommand);
    } else if (line[0] == '2') {
        //std::cout << "----- DEBUG: chosen 2 -----" << std::endl; // TODO: remove debug print
        CheckUrlCommand checkUrlCommand(url, *dataSource);
        invoker.runCommand(checkUrlCommand);
    }
    delete dataSource;
}
