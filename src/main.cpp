// Author(s): Dor Darmon, Yuval Anteby
#include <iostream>
#include <sstream>
#include <algorithm>
#include "utils/InputValidation.h"
#include "utils/BloomInputProccesor.h"


/**
 * Main loop that reads and processes input lines.
 */
int main() {
    std::cout << "welcome" << std::endl; // TODO: remove debug print
    std::string line;
    bool firstLineFlag = true; // true if we're waiting for first line input
    while (std::getline(std::cin, line)) {
        std::cout << "while start" << std::endl; // TODO: remove debug print
        std::cout << "flag: " << firstLineFlag << std::endl; // TODO: remove debug print
        // Skip to next line if the first line was invalid
        if (firstLineFlag && !containsOnlyDigitsAndWhitespace(line) && !isValidFirstLine(line)) {
            continue;
        }
        int firstInt;
        std::vector<int> configInts;
        if(firstLineFlag) {
            // Get the first line's ints, put the first int (bit array size) int one variable
            firstInt = stoi(processFirstInt(line));
            std::cout << firstInt << std::endl; // TODO: remove debug print
            // Get the rest of the config ints in a vector
            configInts = processConfigInts(line);
        }
        
        // Update the first line flag - we can wait for user's command
        firstLineFlag = false;
        if (hasValidCommandStructure(line) && !firstLineFlag) {
            handleUserChoice(line, firstInt, configInts);
        }
    }

    return 0;
}