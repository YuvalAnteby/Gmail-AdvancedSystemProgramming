// Author(s): Yuval Anteby
#include "InsertUrlCommand.h"
#include "Hash/Hasher.h"

// Default constructor
InsertUrlCommand::InsertUrlCommand(const std::string& url, IDataPersistence& persistence, const std::vector<int>& configInts, int size): url(url), persistence(persistence) configInts(configInts) size(size) {
}

/**
 * Excute the insertion command.
 * Will call relevant functions to insert the new URL to the blooom filter.
 */
void InsertUrlCommand::execute() {
    persistence.appendBlacklistedUrl(url);
    std::vector<int> insertConfing = {size};
    insercofing.insert(insercofing.end(), original.begin(), original.end());    
    persistence.appendConfigInts(insercofing);
    Hasher hasher;
    persistence.appendBitArray(hasher->buildHashedArray(url, size, configInts));
    /// TODO: implement insertion to the bloom filter here
    /// Example:
    //std::vector<bool> bits = getHashFunctions::hashUrlToBits(url);  
    //persistence.appendBitArray(bits);
    //persistence.appendBlacklistedUrl(url);
}