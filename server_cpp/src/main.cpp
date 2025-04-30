// Author(s): Dor Darmon, Yuval Anteby
#include <iostream>
#include <sstream>
#include <algorithm>
#include "utils/InputValidation.h"
#include "utils/BloomInputProccesor.h"
#include "data_persistence/IDataPersistence.h"
#include "data_persistence/FilePersistence.h"

/**
 * Main loop that reads and processes input lines.
 */
int main() {
    //std::cout << "----- DEBUG: welcome -----" << std::endl; // TODO: remove debug print
    std::string line;
    bool firstLineFlag = true; // true if we're waiting for first line input
    int firstInt;
    std::vector<int> configInts;
    // Create the data persistence object according to data source (this time we use files)
    IDataPersistence* dataSource = new FilePersistence();
    while (std::getline(std::cin, line)) {
        //std::cout << "----- DEBUG: while start -----" << std::endl; // TODO: remove debug print
        //std::cout << "----- DEBUG: flag=" << firstLineFlag << " -----" << std::endl; // TODO: remove debug print
        // Skip to next line if the first line was invalid
        if (firstLineFlag && !containsOnlyDigitsAndWhitespace(line) && !isValidFirstLine(line)) {
            continue;
        }
        if(firstLineFlag) {
            // Get the first line's ints, put the first int (bit array size) int one variable
            firstInt = stoi(processFirstInt(line));
            // Get the rest of the config ints in a vector
            configInts = processConfigInts(line);
            // Check if the given config ints are matching the ones we saved already, save them if needed.
            if(!isConfigMatching(firstInt, configInts, *dataSource)) {
                continue;
            }
        }
        //std::cout << "----- DEBUG: first number=" << firstInt << " numbers:="; // TODO: remove debug print
        //for(int i=0; i<configInts.size(); i++) {
        //    std::cout << configInts[i] << " "; // TODO: remove debug print
        //}
        //std::cout << " -----" << std::endl; // TODO: remove debug print
        
        // Update the first line flag
        firstLineFlag = false;
        // If still waiting for first line or line isn't valid command - skip it
        if (firstLineFlag || !hasValidCommandStructure(line)) {
            continue;
        }
        // handle the user's command choice
        handleUserChoice(line, firstInt, configInts, *dataSource);
    }
    delete dataSource;
    return 0;
}