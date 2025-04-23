#include <iostream>
#include <sstream>
#include "utils/InputValidation.h"


/**
 * Process a valid command line:
 * - If it starts with '1', add the URL
 * - If it starts with '2', check against the blacklist
 * @param line string of the user's choice of command & the url string
 * @param filter bloom filter object reference
 */
void handleUserChoice(const std::string& line, BloomFilter& filter) {
    if (line.size() < 3) {
        std::cout << "false" << std::endl;
        return;
    }

    std::string url = line.substr(2);  // Extract URL after command and space

    if (!isValidURL(url)) {
        std::cout << "false" << std::endl;
        return;
    }

    if (line[0] == '1') {
        //filter.add(url);
        // TODO: insert new URL to filter here
    } else if (line[0] == '2') {
        // TODO: Roee's work here
    }
}

/**
 * Main loop that reads and processes input lines.
 */
int main() {
    // TODO: use here bloom filter object by Roee
    //BloomFilter filter;
    std::string line;
    bool firstLineFlag = true;
    while (std::getline(std::cin, line)) {
        // Skip to next line if the first line was invalid
        if (firstLineFlag && !processLine(line)) {
            continue;
        }
        firstLineFlag = false;
        if (isValidLine(line)) {
            handleUserChoice(line, filter);
        } else {
            std::cout << "false" << std::endl;
        }
    }

    return 0;
}