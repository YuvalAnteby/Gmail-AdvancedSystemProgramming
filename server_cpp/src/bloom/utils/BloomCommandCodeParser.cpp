// @Author(s): Yuval Anteby

#include "BloomCommandCodeParser.h"

/**
 * Convert the bloom filter command enum to a string
 * @param commandCode enum of the command code. e.g. DELETE (=3)
 * @return string of command. e.g. "POST"
 */
std::string toCommandString(const BloomFilterCommandEnum commandCode) {
    switch (commandCode) {
        case CONFIG_INTS:
            return "";
        case POST:
            return "POST";
        case GET:
            return "GET";
        case DELETE:
            return "DELETE";
        default:
            return "";
    }
}

/**
 * Convert a string to the bloom filter command enum if valid
 * @param commandString string of a supposed command. e.g. "DELETE"
 * @return enum of the command code. e.g. POST (=1)
 */
BloomFilterCommandEnum toCommandCode(const std::string &commandString) {
    if (commandString == "POST" || commandString == "1") {
        return POST;
    }
    if (commandString == "GET" || commandString == "2") {
        return GET;
    }
    if (commandString == "DELETE") {
        return DELETE;
    }
    return CMD_NONE;
}
