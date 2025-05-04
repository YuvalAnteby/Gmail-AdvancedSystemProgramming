// Author(s): Yuval Anteby
#ifndef CONSOLE_OUTPUT_WRITER_H
#define CONSOLE_OUTPUT_WRITER_H

#include "strategyIO/IOutputWriter.h"
#include <string>

/**
 * Class responsible on printing input for the user, using the CLI.
 * prints strings (could be more than 1 line at once using "\n"
 * Used as part of the strategy design pattern for Input-Output
 */
class ConsoleOutputWriter : public IOutputWriter {
    public:
      // Default constructor
      ConsoleOutputWriter();
      void writeData(std::string& line) override;
};



#endif
