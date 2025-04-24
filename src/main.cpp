#include <iostream>
#include <sstream>
#include <cctype>
#include <algorithm>
#include <regex>
#include "up_utils/utils.h"
#include "utils.h"
/**
 * Main loop that reads and processes input lines.
 */
int main() {
    std::string line;
    bool firstLineFlag = true;
    while (std::getline(std::cin, line)) {
        if (firstLineFlag && !processLine(line)) {
            continue;
        }
        firstLineFlag = false;
        if (isValidLine(line)) {
            handleUserChoice(line);
        } else {
            std::cout << "false" << std::endl;
        }
    }
    return 0;
}
