// Author(s): Yuval Anteby, Roee Chaim
#include "CheckUrlCommand.h"
#include "bloom/hash/Hasher.h"
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

/**
 * Constructor for production usage.
 * Initializes CheckUrlCommand with a URL, persistence layer, Bloom filter configuration, and size.
 *
 * @param url the URL to be checked
 * @param persistence the persistence object used to load bit arrays and blacklist
 * @param configInts vector of configuration integers used for hashing
 * @param size the size of the Bloom filter bit array
 */
CheckUrlCommand::CheckUrlCommand(const std::string& url, IDataPersistence& persistence, const std::vector<int>& configInts, int size)
    : url(url), persistence(persistence), configInts(configInts), size(size), result(false) {
}

/**
 * Constructor used mainly for tests where configInts and size can be retrieved from persistence.
 *
 * @param url the URL to be checked
 * @param persistence the persistence object used to load bit arrays and blacklist
 */
CheckUrlCommand::CheckUrlCommand(const std::string& url, IDataPersistence& persistence)
    : url(url), persistence(persistence), result(false) {
}

/**
 * Checks if the hashed version of the URL could be contained in any candidate Bloom filter.
 *
 * @param url the URL to hash
 * @param size the size of the Bloom filter
 * @param counts a list of integers to vary the hash function (e.g., different seeds)
 * @param candidates a list of bit arrays representing possible Bloom filters
 * @return true if the hashed URL matches any candidate Bloom filter, false otherwise
 */
bool CheckUrlCommand::possiblyContains(
    const std::string& url,
    int size,
    const std::vector<int>& counts,
    const std::vector<std::vector<bool>>& candidates
) {
    // Create a Hasher object for the URL
    Hasher hasher(url);

    // Build the hashed bit array according to the counts and Bloom filter size
    std::vector<bool> hashedArray = hasher.buildHashedArray(url, size, counts);

    // Check the hashed array against each candidate bit array
    for (const auto& candidate : candidates) {
        bool match = true;
        for (int i = 0; i < size; ++i) {
            // If a bit is required by hashedArray but missing in the candidate, it's not a match
            if (hashedArray[i] && !candidate[i]) {
                match = false;
                break;
            }
        }
        // Found a matching Bloom filter
        if (match) {
            return true;
        }
    }
    // No candidate matched
    return false;
}

/**
 * Checks if a given URL exactly matches any URL in the provided list (e.g., the blacklist).
 *
 * @param url the URL to check
 * @param list a vector of blacklisted URLs
 * @return true if URL is found in the list, false otherwise
 */
bool CheckUrlCommand::matchesURL(const std::string& url, const std::vector<std::string>& list) {
    return std::find(list.begin(), list.end(), url) != list.end();
}

/**
 * Executes the CheckUrlCommand.
 * 
 * Steps:
 * 1. Loads the persisted Bloom filter bit arrays.
 * 2. Checks if the hashed URL bits could possibly exist in the Bloom filter.
 * 3. If possibly contained, checks blacklist for actual URL match.
 * 4. Prints the result and updates the internal result state (`true` or `false`).
 */
void CheckUrlCommand::execute() {
    // Load Bloom filter bit arrays from persistence
    std::vector<std::vector<bool>> bitsArrays = persistence.loadBitArrays();

    // Check if the URL possibly exists in any Bloom filter
    if (possiblyContains(url, size, configInts, bitsArrays)) {
        std::cout << "true ";
        // If possibly contained, check blacklist for real match
        if (matchesURL(url, persistence.loadBlacklist())) {
            std::cout << "true" << std::endl;
            result = true;
        } else {
            result = false;
            std::cout << "false" << std::endl;
        }
    } else {
        // Definitely not in the Bloom filter
        std::cout << "false" << std::endl;
        result = false;
    }
}

/**
 * Returns the result of the check.
 *
 * @return true if the URL was found in the Bloom filter and verified in the blacklist, false otherwise
 */
bool CheckUrlCommand::wasFound() const {
    return result;
}
