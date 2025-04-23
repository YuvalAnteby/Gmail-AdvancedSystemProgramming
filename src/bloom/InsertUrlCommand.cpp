// Author(s): Yuval Anteby
#include "InsertUrlCommand.h"
#include "Hash/HashFunctions.h"

// Default constructor
InsertUrlCommand::InsertUrlCommand(const std::string& url, IDataPersistence& persistence): url(url), persistence(persistence) {}

/**
 * Excute the insertion command.
 * Will call relevant functions to insert the new URL to the blooom filter.
 */
void InsertUrlCommand::execute() {
    /// TODO: implement insertion to the bloom filter here
    /// Example:
    //std::vector<bool> bits = getHashFunctions::hashUrlToBits(url);  
    //persistence.appendBitArray(bits);
    //persistence.appendBlacklistedUrl(url);
}