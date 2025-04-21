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

// Second hash function – a small twist: add a character to the string before hashing
size_t BloomFilter::hash2(const std::string& str) const {
    std::hash<std::string> hasher;
    return (hasher(str + "!")) % size;
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

// Update the size and number of hash functions for the filter
// Useful if you want to tune accuracy or memory use on the fly
void BloomFilter::updateConfig(size_t newSize, int newNumHashes) {
    size = newSize;
    numHashes = newNumHashes;
    bitArray.resize(size, false);  // Reset bit array with new size (all false by default)
}

// Restore the Bloom filter state from persistent storage (e.g., after restarting)
void BloomFilter::loadExistingData() {
    // First, load previously stored bit arrays and merge them into our current array
    auto bitArrays = persistence->loadBitArrays();
    for (const auto& bits : bitArrays) {
        for (size_t i = 0; i < bits.size(); ++i) {
            if (bits[i]) {
                bitArray[i] = true;
            }
        }
    }

    // Then, load the actual list of blacklisted URLs and re-add them
    // This ensures the hash positions are correctly populated
    auto blacklist = persistence->loadBlacklist();
    for (const auto& url : blacklist) {
        add(url);
    }
}
