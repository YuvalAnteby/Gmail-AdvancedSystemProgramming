// Author(s): Yuval Anteby

#include "CommandRequest.h"
#include <string>
#include "bloom/utils/command_code/BloomCommandCodeParser.h"

/**
 * Constructor
 */
CommandRequest::CommandRequest(std::string& command, std::string& url)
    : m_command(toCommandCode(command)), m_url(url) {}

/**
 * Getter for the command
 * @return command as enum code
 */
BloomFilterCommandEnum CommandRequest::getCommand() {
  return m_command;
}

/**
 * Getter for the URL
 * @return the URL we got from the user
 */
std::string CommandRequest::getUrl() {
  return m_url;
}
