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
* @param line a line of input from the console by the user
* @return false if received a newline or EOF etc., otherwise true
*/
bool ConsoleInputReader::readLine(std::string line) {
    //TODO add validation tests here
    return static_cast<bool>(std::getline(std::cin, line));
}