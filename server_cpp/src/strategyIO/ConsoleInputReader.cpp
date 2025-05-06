// @Author(s): Yuval Anteby

#include "ConsoleInputReader.h"

#include <iostream>
/// TODO add tests

/**
* Default constructor
*/
ConsoleInputReader::ConsoleInputReader() = default;

/**
* Get a line of input from the console
* @return a line of input from the console by the user
*/
std::string ConsoleInputReader::readLine() {
    //TODO add validation tests here
    std::string line;
    std::getline(std::cin, line);
    return line;
}