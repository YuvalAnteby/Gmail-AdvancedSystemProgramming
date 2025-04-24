// Author(s): Yuval Anteby
#include "CheckUrlCommand.h"
#include "Hash/Hasher.h"

// Default constructor
CheckUrlCommand::CheckUrlCommand(const std::string& url, IDataPersistence& persistence) : url(url), persistence(persistence), result(false) {}

/**
 * Checks if a hashed representation of a string is possibly contained in a Bloom filter.
 * This simulates the "possibly contains" check of a Bloom filter by ensuring all bits set by the
 * hash functions also exist in at least one of the candidate Bloom filters.
 * @param url The string to hash (e.g., a URL).
 * @param size The size of the Bloom filter bit array.
 * @param counts The number of times to apply the hash function (simulating multiple hash functions).
 * @param candidates A list of existing Bloom filter bit arrays.
 * @return true if the URL could possibly be in one of the filters (all relevant bits are set), false if definitely not.
 */
bool possiblyContains(
    const std::string& url,
    int size,
    const std::vector<int>& counts,
    const std::vector<std::vector<bool>>& candidates
) {
    std::vector<bool> hashedArray = buildHashedArray(url, size, counts);

    for (const auto& candidate : candidates) {
        bool match = true;

        for (int i = 0; i < size; ++i) {
            if (hashedArray[i] && !candidate[i]) {
                match = false;
                break;
            }
        }

        if (match) {
            return true;
        }
    }

    return false;
}
//  This function checks if the given url matches any string in the list
bool matchesURL(const std::string& url, const std::vector<std::string>& list) {
    // check each string in the vector
    for (const auto& str : list) {
        if (str == url) {
            return true;// Match found
        }
    }
    return false;
}
/**
 * Excute the check URL command.
 * Will call relevant functions to check if a given URL is in the blooom filter.
 */
void CheckUrlCommand::execute() {
    if(possiblyContains(url, persistence->getBitSizeConfig, persistence->loadConfigInts(), persistence->loadBitArrays()) == true){
        std::cout << "true ";
        // check its a false positives by checking the url in the data.
       if (matchesURL(url, persistence->loadBlacklist())){
       return true;
       else{
        return false;
       }
    }

    }
     else {
    std::cout << "false" << std::endl;

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