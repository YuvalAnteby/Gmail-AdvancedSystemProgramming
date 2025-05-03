// Author(s): Yuval Anteby

#include <string>
#include <bloom/models/BloomCommandResult.h>
#include <utils/BloomFilterStatusEnum.h>

/**
 * Convert the bloom filter status code to a message
 * @param statusCode enum of the status code
 * @return a full message containing the code & message.
 * e.g. "404 Not Found"
 */
std::string toStatusMessage(const BloomFilterStatusEnum statusCode) {
    switch (statusCode) {
        case NONE:
            return "-1 No command ran";
        case OK:
            return "200 Ok";
        case CREATED:
            return "201 Created";
        case NO_CONTENT:
            return "204 No Content";
        case BAD_REQUEST:
            return "400 Bad Request";
        case NOT_FOUND:
            return "404 Not Found";
        default:
            return "";
    }
}
