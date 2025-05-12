// Author(s): Yuval Anteby
#ifndef COMMAND_REQUEST_H
#define COMMAND_REQUEST_H

#include <string>
#include "bloom/utils/command_code/BloomFilterCommandEnum.h"


/**
 * Class to represent a command request.
 * Made of the command enum and the URL.
 */
class CommandRequest {
    BloomFilterCommandEnum m_command; // e.g. POST, GET
    std::string m_url; // a valid URL

public:
    CommandRequest(std::string &command, std::string &url);

    BloomFilterCommandEnum getCommand();

    std::string getUrl();
};


#endif
