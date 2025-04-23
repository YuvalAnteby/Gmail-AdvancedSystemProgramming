// Author(s): Yuval Anteby
#include "CheckUrlCommand.h"
#include "Hash/HashFunctions.h"

// Default constructor
CheckUrlCommand::CheckUrlCommand(const std::string& url, IDataPersistence& persistence) : url(url), persistence(persistence), result(false) {}

/**
 * Excute the check URL command.
 * Will call relevant functions to check if a given URL is in the blooom filter.
 */
void CheckUrlCommand::execute() {
    ///TODO: implement checking URL here
    /// Example:
    //std::vector<bool> bits = HashUtils::hashUrlToBits(url);
    //result = persistence.isBitArrayInBloomFilter(bits);
}

/**
 * @return true if a given URL is indeed in the bloom filter (including checking false positive cases), otherwise false.
 */
bool CheckUrlCommand::wasFound() const {
    return result;
}