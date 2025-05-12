// Author(s): Yuval Anteby

#include "DeleteUrlCommand.h"
#include "strategy_io/utils/InputValidation.h"
#include "bloom/utils/status_code/BloomFilterStatusCodeParser.h"

DeleteUrlCommand::DeleteUrlCommand(const std::string &url, IDataPersistence &persistence, IOutputWriter &outputWriter)
    : m_url(url), m_persistence(persistence), m_bloomResult(DELETE), m_outputWriter(outputWriter) {
}

/**
 * Executes the URL deletion command.
 */
void DeleteUrlCommand::execute() {
    // URL validation check
    if (!isValidURL(m_url)) {
        m_bloomResult.setStatusCode(BAD_REQUEST);
        m_bloomResult.setIsSuccess(false);
        return;
    }
    // Execute the deletion
    const BloomFilterStatusEnum outcomeEnum = m_persistence.deleteUrl(m_url);
    // Update the bloom result according to the outcome
    switch (outcomeEnum) {
        case NO_CONTENT: // successfully deleted
            m_bloomResult.setIsSuccess(true);
            m_bloomResult.setStatusCode(NO_CONTENT);
            break;
        case NOT_FOUND: // URL isn't in file
            m_bloomResult.setIsSuccess(false);
            m_bloomResult.setStatusCode(NOT_FOUND);
            break;
        default: // some other error
            m_bloomResult.setIsSuccess(false);
            m_bloomResult.setStatusCode(BAD_REQUEST);
            break;
    }
}

/**
 * Returns the result of the deletion.
 *
 * @return a command result object with the result of the check (including code, messages etc.)
 */
BloomCommandResult DeleteUrlCommand::getResult() {
    const std::string msg = toStatusMessage(m_bloomResult.getStatusCode()) + "\n";
    m_bloomResult.appendToOutcomeMessage(msg);
    m_bloomResult.setFullMessage(msg);
    return m_bloomResult;
}
