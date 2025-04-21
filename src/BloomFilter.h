#ifndef BLOOM_FILTER_H
#define BLOOM_FILTER_H

#include "data_persistence/IDataPersistence.h"
#include <vector>
#include <string>
#include <unordered_set>

class BloomFilter {
private:
    size_t size;
    int numHashes;
    std::vector<bool> bitArray;
    IDataPersistence* persistence; 

    size_t hash1(const std::string& str) const;
    size_t hash2(const std::string& str) const;

public:
    BloomFilter(size_t size, int numHashes, IDataPersistence* persistence);

    void add(const std::string& url);
    bool mightContain(const std::string& url) const;
    bool isReallyBlacklisted(const std::string& url) const;
    void updateConfig(size_t newSize, int newNumHashes);
    void loadExistingData();
};

#endif
