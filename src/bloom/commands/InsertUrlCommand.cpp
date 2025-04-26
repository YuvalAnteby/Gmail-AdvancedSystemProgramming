// Author(s): Yuval Anteby
#include <iostream> //TODO: remove
#include "InsertUrlCommand.h"
#include "bloom/hash/Hasher.h"

// Default constructor
InsertUrlCommand::InsertUrlCommand(const std::string& url, IDataPersistence& persistence, const std::vector<int>& configInts, int size)
: url(url), persistence(persistence), configInts(configInts), size(size) {

}

/**
 * Excute the insertion command.
 * Will call relevant functions to insert the new URL to the blooom filter.
 */
void InsertUrlCommand::execute() {
    // Insert URL
    persistence.appendBlacklistedUrl(url);
    // Hash and insert the bit array
    Hasher hasher(url);
    persistence.appendBitArray(hasher.buildHashedArray(url, size, configInts));
}