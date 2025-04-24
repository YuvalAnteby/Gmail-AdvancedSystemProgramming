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
    std::string line;
    bool firstLineFlag = true; // true if we're waiting for first line input
    while (std::getline(std::cin, line)) {
        // Skip to next line if the first line was invalid
        if (firstLineFlag && !isValidFirstLine(line)) {
            continue;
        }
        // Get the first line's ints, put the first int (bit array size) int one variable
        int firstInt = stoi(processFirstInt(line));
        
        // Get the rest of the config ints in a vector
        std::vector<int> configInts = processConfigInts(line);

        // Update the first line flag - we can wait for user's command
        firstLineFlag = false;
        if (isValidLine(line)) {
            handleUserChoice(line);
        }
    }

    return 0;
}