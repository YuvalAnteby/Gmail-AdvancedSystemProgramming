// Author(s): Yuval Anteby
#include "CheckUrlCommand.h"
#include "hash/Hasher.h"
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

// Default constructor
CheckUrlCommand::CheckUrlCommand(const std::string& url, IDataPersistence& persistence)
    : url(url), persistence(persistence), result(false) {}

/**
 * Checks if a hashed representation of a string is possibly contained in a Bloom filter.
 */
bool CheckUrlCommand::possiblyContains(
    const std::string& url,
    int size,
    const std::vector<int>& counts,
    const std::vector<std::vector<bool>>& candidates
) {
    Hasher hasher(url);
    std::vector<bool> hashedArray = hasher.buildHashedArray(url, size, counts);

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

/**
 * Checks if the given url matches any string in the list.
 */
bool CheckUrlCommand::matchesURL(
    const std::string& url,
    const std::vector<std::string>& list
) {
    return std::find(list.begin(), list.end(), url) != list.end();
}

/**
 * Execute the check URL command.
 * Prints "true " if possibly contains and checks blacklist for true/false result.
 */
void CheckUrlCommand::execute() {
    if (possiblyContains(url,
        persistence.getBitSizeConfig(),
        persistence.loadConfigInts(),
        persistence.loadBitArrays()) == true) {
        std::cout << "true ";
        if (matchesURL(url, persistence.loadBlacklist())) {
            result = true;
        } else {
            result = false;
        }
    } else {
        result = false;
    }
}

/**
 * @return true if a given URL is indeed in the bloom filter (including checking false positive cases), otherwise false.
 */
bool CheckUrlCommand::wasFound() const {
    return result;
}
