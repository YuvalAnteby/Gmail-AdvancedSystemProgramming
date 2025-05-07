// @Author(s): Yuval Anteby

#include "ConsoleInputReader.h"

#include <iostream>

/**
* Default constructor
*/
ConsoleInputReader::ConsoleInputReader() = default;

/**
* Get a line of input from the console
* @return a line of input from the console by the user
*/
std::string ConsoleInputReader::readLine() {
    std::string line;
    std::getline(std::cin, line);
    // Enables exiting using the shortcut in CLI
    if (std::cin.eof()) {
        exit(0);
    }
    return line;
}