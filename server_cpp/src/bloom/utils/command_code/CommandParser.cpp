// Author(s): Yuval Anteby

#include "./CommandParser.h"
#include "./bloom/commands/utils/CommandRequest.h"
#include "bloom/utils/command_code/BloomCommandCodeParser.h"
#include "strategy_io/utils/InputValidation.h"
#include <sstream>
#include <string>

///TODO create tests
/**
* Turns a line of input to a command request object.
* @param line line of input from the user
* @return command request object made of {string command, string url}
*/
CommandRequest CommandParser::parseCommand(const std::string& line) {
  // If input is empty then it's invalid
  if(line.empty()) {
    std::string emptyString = "";
    return CommandRequest{emptyString, emptyString};
  }
  std::istringstream iss(line);
  std::string command;
  std::string url;
  iss >> command >> url;
  BloomFilterCommandEnum cmdCode = toCommandCode(command);
  // check validation of the URL
  if(!isValidURL(url) || cmdCode == CMD_NONE) {
    std::string emptyString = "";
    return CommandRequest{emptyString, emptyString};
  }
  // Valid input, create the request object
  return CommandRequest{command, url};
}
