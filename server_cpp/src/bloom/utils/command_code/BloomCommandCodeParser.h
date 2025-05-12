// Author(s): Yuval Anteby

#ifndef BLOOM_COMMAND_CODE_PARSER_H
#define BLOOM_COMMAND_CODE_PARSER_H

#include <string>
#include "BloomFilterCommandEnum.h"

std::string toCommandString(BloomFilterCommandEnum commandCode);
BloomFilterCommandEnum toCommandCode(const std::string &commandString);



#endif
