#pragma once
#include <vector>
#include <string>
#include <unordered_set>
#include <functional>

class BloomFilter {
public:
    BloomFilter(size_t size, std::vector<std::function<size_t(const std::string&)>> hashFuncs);
    bool mightContain(const std::string& item) const;
    bool isItActuallyBlacklisted(const std::string& item) const;
private:
    std::vector<bool> bits;
    size_t size;
    std::vector<std::function<size_t(const std::string&)>> hashFuncs;
};
