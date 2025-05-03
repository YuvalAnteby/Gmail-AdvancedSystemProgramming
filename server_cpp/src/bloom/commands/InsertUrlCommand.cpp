// Author(s): Yuval Anteby
#include "InsertUrlCommand.h"
#include "bloom/hash/Hasher.h"
#include "bloom/utils/BloomFilterStatusCodeParser.h"

/**
 * Default constructor
 * @param url the URL to be checked
 * @param persistence data source for the bits, URLs and config needed
 * @param configInts array of ints given by the user for the bloom filter
 * @param size bit array size
 */
InsertUrlCommand::InsertUrlCommand(const std::string &url, IDataPersistence &persistence,
                                   const std::vector<int> &configInts, int size)
    : url(url), persistence(persistence), configInts(configInts), size(size), m_bloomResult(POST) {
}

/**
 * Execute the insertion command.
 * Will call relevant functions to insert the new URL to the bloom filter.
 */
void InsertUrlCommand::execute() {
    // Insert URL
    m_bloomResult.setIsSuccess(persistence.appendBlacklistedUrl(url));
    // Some error happened, no instruction about it in the assignment so just set bad request code
    if (!m_bloomResult.getIsSuccess()) {
        m_bloomResult.setStatusCode(BAD_REQUEST);
        return;
    }
    // Hash and insert the bit array
    Hasher hasher(url);
    m_bloomResult.setIsSuccess(persistence.appendBitArray(hasher.buildHashedArray(url, size, configInts)));
    // Some error happened, no instruction about it in the assignment so just set bad request code
    if (!m_bloomResult.getIsSuccess()) {
        m_bloomResult.setStatusCode(BAD_REQUEST);
        return;
    }
    // Added successfully, update the code
    m_bloomResult.setStatusCode(CREATED);
}

/**
 * Returns the result of the insertion.
 *
 * @return a command result object with the result of the insert (including code, messages etc.)
 */
BloomCommandResult InsertUrlCommand::getResult() {
    // Set the message to the client as requested in the instructions (the same for errors and success
    m_bloomResult.setFullMessage(m_bloomResult.getStatusCode() + "\n");
    return m_bloomResult;
}
