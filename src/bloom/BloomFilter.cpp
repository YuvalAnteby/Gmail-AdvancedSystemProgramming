#include "bloom/BloomFilter.h"
#include "data_persistence/FilePersistence.h"

BloomFilter::BloomFilter(size_t size, std::vector<std::function<size_t(const std::string&)>> hashFuncs)
    : bits(size, false), size(size), hashFuncs(std::move(hashFuncs)) {}

    bool BloomFilter::mightBeInFilter(const std::string& item, const std::vector<std::vector<bool>>& bitArrays) const {
        for (size_t i = 0; i < bitArrays.size(); ++i) {
            size_t index = getHash(item, i) % bitArrays[i].size();
            if (!bitArrays[i][index]) {
                return false; // One bit not set → definitely not in set
            }
        }
        return true; // All bits set → possibly in set
    }
    



bool BloomFilter::isActuallyBlacklisted(const std::string& item) const {
    std::vector<std::string> blackList = loadBlackListUrl();
    for (const std::string& blacklistedItem : blackList) {
        if (blacklistedItem == item) {
            return true;
        }
    }
    return false;
}


