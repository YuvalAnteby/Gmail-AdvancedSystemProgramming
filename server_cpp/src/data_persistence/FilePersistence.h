// Author(s): Yuval Anteby
#ifndef FILE_PERSISTENCE_H
#define FILE_PERSISTENCE_H

#include "data_persistence/IDataPersistence.h"

/**
 * Implementation of IDataPersistence based on files (.txt).
 * 
 * Saves Bloom filter bit array and blacklisted URLs to .txt files.
 */
class FilePersistence : public IDataPersistence {
private:
    // Default paths for the .txt files.
    const std::string bitArrayPath = "data/bloom_bits.txt";
    const std::string blacklistPath = "data/blacklist.txt";
    const std::string configIntsPath = "data/config_bloom.txt";
    

public:
    // Default Constructor
    FilePersistence();
    
    // Bits related functions from interface
    std::vector<std::vector<bool>> loadBitArrays() override;
    bool appendBitArray(const std::vector<bool>& bits) override;

    // Blacklisted URLs related functions from interface
    std::vector<std::string> loadBlacklist() override;
    bool appendBlacklistedUrl(const std::string& url) override;
    BloomFilterStatusEnum deleteUrl(const std::string& url) override;

    // Config related function
    std::vector<int> loadConfigInts() override;
    bool appendConfigInts(const std::vector<int>& configInts) override;
    int getBitSizeConfig() override;

};

#endif