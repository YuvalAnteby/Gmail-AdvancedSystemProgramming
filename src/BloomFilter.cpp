#include "BloomFilter.h"
#include <functional>


// Constructor: Set up the Bloom filter with given size, number of hash functions, and a persistence layer
BloomFilter::BloomFilter(size_t size, int numHashes, IDataPersistence* persistence)
    : size(size), numHashes(numHashes), bitArray(size, false), persistence(persistence) {}

// First hash function – standard hash of the string, modulo the bit array size
size_t BloomFilter::hash1(const std::string& str) const {
    std::hash<std::string> hasher;
    return hasher(str) % size;
}

// TODO: 
size_t BloomFilter::hash2(const std::string& str) const {
    std::hash<std::string> hasher;
    return hasher((hasher(str))) % size;
}

// Add a URL to the Bloom filter  Also append it to persistent storage so we can later double-check
void BloomFilter::add(const std::string& url) {
    if (numHashes >= 1) bitArray[hash1(url)] = true;
    if (numHashes >= 2) bitArray[hash2(url)] = true;

    // Persist the blacklisted URL for future verification
    persistence->appendBlacklistedUrl(url);  
}

// Check if a URL *might* be in the blacklist
// Because Bloom filters can have false positives, this is only a guess
bool BloomFilter::mightContain(const std::string& url) const {
    if (numHashes >= 1 && !bitArray[hash1(url)]) return false;
    if (numHashes >= 2 && !bitArray[hash2(url)]) return false;
    return true; // It might be there – or it's a false positive
}

// Check the persistent layer to know for sure if a URL was blacklisted
bool BloomFilter::isReallyBlacklisted(const std::string& url) const {
    return persistence->isUrlBlacklisted(url);
}
