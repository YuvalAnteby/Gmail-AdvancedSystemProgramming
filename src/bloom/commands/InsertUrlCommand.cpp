// Author(s): Yuval Anteby
#include "InsertUrlCommand.h"
#include "bloom/hash/Hasher.h"

// Default constructor
InsertUrlCommand::InsertUrlCommand(const std::string& url, IDataPersistence& persistence, const std::vector<int>& configInts, int size)
: url(url), persistence(persistence), configInts(configInts), size(size) {}

/**
 * Excute the insertion command.
 * Will call relevant functions to insert the new URL to the blooom filter.
 */
void InsertUrlCommand::execute() {
    persistence.appendBlacklistedUrl(url);
    std::vector<int> insertConfing = {size};
    insertConfing.insert(insertConfing.end(), configInts.begin(), configInts.end());
    persistence.appendConfigInts(insertConfing);
    Hasher hasher(url);
    persistence.appendBitArray(hasher.buildHashedArray(url, size, configInts));
    /// TODO: implement insertion to the bloom filter here
    /// Example:
    //std::vector<bool> bits = getHashFunctions::hashUrlToBits(url);  
    //persistence.appendBitArray(bits);
    //persistence.appendBlacklistedUrl(url);
}