// @Author(s): Yuval Anteby

#ifndef CONSOLE_INPUT_READER_H
#define CONSOLE_INPUT_READER_H

#include "strategy_io/IInputReader.h"

/**
 * Class responsible on getting input from the user, using the CLI.
 * Read line by line.
 * Used as part of the strategy design pattern for Input-Output
 */
class ConsoleInputReader : public IInputReader {

  public:
    // Default constructor
    ConsoleInputReader();

    std::string readLine() override;
};



#endif
