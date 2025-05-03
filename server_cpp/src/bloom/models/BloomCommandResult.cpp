// Author(s): Yuval Anteby
#include <string>
#include "BloomCommandResult.h"
#include "utils/BloomFilterCommandEnum.h"
#include "utils/BloomFilterStatusEnum.h"

/**
 * Default constructor.
 * Get the command we used (for tracking), update the rest of the info as we go.
 * @param commandUsed the enum for the command we used
 */
BloomCommandResult::BloomCommandResult(const BloomFilterCommandEnum commandUsed)
    : m_commandUsed(commandUsed), m_isSuccess(false), m_status(NONE), m_outcomeMsg(""), m_fullMsg("") {}

/**
 * Getter for the command used
 * @return enum of the bloom command we used
 */
BloomFilterCommandEnum BloomCommandResult::getBloomFilterCommand() const {
  return m_commandUsed;
}

/**
 * Getter for the success indicator
 * @return true if we managed to run successfully the command, otherwise false
 */
bool BloomCommandResult::getIsSuccess() const {
    return m_isSuccess;
}

/**
 * Getter for the status code enum
 * @return enum of the status code according to the command outcome
 */
BloomFilterStatusEnum BloomCommandResult::getStatusCode() const {
    return m_status;
}

/**
 * Getter for the short message
 * @return a short message of the command's outcome.
 * e.g. "true false" (for the case of false-positive check command)
 */
std::string BloomCommandResult::getOutcomeMessage() const {
    return m_outcomeMsg;
}

/**
 * Getter for the full message
 * @return a short message of the command's outcome.
 * e.g. "200 Ok\n\n true false" (for the case of false-positive check command)
 */
std::string BloomCommandResult::getFullMessage() const {
    return m_fullMsg;
}

/**
 * Setter for the success indicator
 * @param success true if the command succeeded, otherwise false
 */
void BloomCommandResult::setIsSuccess(const bool success) {
    m_isSuccess = success;
}

/**
 * Setter for the status code enum
 * @param status enum value of the status
 */
void BloomCommandResult::setStatusCode(const BloomFilterStatusEnum status) {
    m_status = status;
}

/**
 * Add a new part to the outcome message
 * @param message the new text to add (including a newline/space to put before the previous text)
 */
void BloomCommandResult::appendToOutcomeMessage(const std::string &message) {
    m_outcomeMsg += message;
}

void BloomCommandResult::setFullMessage(const std::string &fullMsg) {
    m_fullMsg = fullMsg;
}