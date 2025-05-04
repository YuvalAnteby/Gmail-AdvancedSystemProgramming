// Author(s): Yuval Anteby
#ifndef COMMAND_PARSER_H
#define COMMAND_PARSER_H

#include "CommandRequest.h"
#include <string>

/**
 * Class responsible on parsing input into command objects
 */
class CommandParser {
    public:
      static CommandRequest parseCommand(const std::string& line);
};


#endif
