// Author(s): Yuval Anteby
#ifndef BLOOM_COMMAND_RESULT_H
#define BLOOM_COMMAND_RESULT_H

#include <string>
#include "utils/BloomFilterStatusEnum.h"
#include "utils/BloomFilterCommandEnum.h"

/**
 * Class to represent the result of running a Bloom Filter command.
 * Using an int code to
 */
class BloomCommandResult {
    BloomFilterCommandEnum m_commandUsed;
    bool m_isSuccess;
    BloomFilterStatusEnum m_status;
    std::string m_outcomeMsg;
    std::string m_fullMsg;

public:
    // Constructor
    BloomCommandResult(BloomFilterCommandEnum commandUsed);

    // Getters
    BloomFilterCommandEnum getBloomFilterCommand() const;

    bool getIsSuccess() const;

    BloomFilterStatusEnum getStatusCode() const;

    std::string getOutcomeMessage() const;

    std::string getFullMessage() const;

    // Setters
    void setIsSuccess(bool success);

    void setStatusCode(BloomFilterStatusEnum status);

    void setFullMessage(const std::string &fullMsg);

    void appendToOutcomeMessage(const std::string &message);

};

#endif
