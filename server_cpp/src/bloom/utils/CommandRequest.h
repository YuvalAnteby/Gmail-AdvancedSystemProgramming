// Author(s): Yuval Anteby
#ifndef COMMAND_REQUEST_H
#define COMMAND_REQUEST_H

#include <string>
#include "BloomFilterCommandEnum.h"

/**
 * Class to represent a command request.
 * Made of the command enum and the URL.
 */
class CommandRequest {
  private:
    BloomFilterCommandEnum m_command; // e.g. POST, GET
    std::string m_url; // a valid URL

  public:
    CommandRequest(std::string& command, std::string& url);
    const BloomFilterCommandEnum getCommand();
    const std::string getUrl();
};



#endif
