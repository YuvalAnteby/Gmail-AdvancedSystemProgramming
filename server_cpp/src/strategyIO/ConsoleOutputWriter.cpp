// Author(s): Yuval Anteby
#include "ConsoleOutputWriter.h"
#include <iostream>

/// TODO add tests

/**
* Default constructor
*/
ConsoleOutputWriter::ConsoleOutputWriter() = default;

/**
* Print the given string to the CLI
* @param line the string to print
*/
void ConsoleOutputWriter::writeData(std::string& line) {
  std::cout << line << std::endl;
}