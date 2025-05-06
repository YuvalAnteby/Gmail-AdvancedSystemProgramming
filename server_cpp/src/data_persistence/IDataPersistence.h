// Author(s): Yuval Anteby
#ifndef IFILE_PERSISTENCE_H
#define IFILE_PERSISTENCE_H

#include <stdexcept>
#include <vector>
#include <string>
#include "bloom/utils/BloomFilterStatusEnum.h"

/**
 * Interface for file management of Bloom Filter.
 * 
 * Allows loading and saving bit arrays and blacklisted URLs.
 * Implementations can store the data in various ways (e.g. file, DB etc.)
 */
class IDataPersistence {
public:

    virtual ~IDataPersistence() = default;

    /**
     * Insert the new bit array.
     * @param vector of bit array to save.
     * @return true if added successfully, otherwise false
     */
    virtual bool appendBitArray(const std::vector<bool>& bits) = 0;

    /**
     * Load the entire bits arrays which represents the Bloom Filter.
     * @return A vector of a vector of bools, each element represents a bit array.
     */
    virtual std::vector<std::vector<bool>> loadBitArrays() = 0;

    /**
     * Insert the blacklisted URL.
     * @param URLs The URL to save.
     * @return true if added successfully, otherwise false
     */
    virtual bool appendBlacklistedUrl(const std::string& url) = 0;

    /**
     * Load the list of blacklisted URLs (used for false-positive checks).
     * @return A vector of blacklisted URLs.
     */
    virtual std::vector<std::string> loadBlacklist() = 0;
    

    /**
     * Save the config ints, given by the user's input.
     * @param vector first int is bit array size (first int in the input), the rest are how many times to run hash
     * functions
     * @return true if added successfully, otherwise false
     */
    virtual bool appendConfigInts(const std::vector<int>& configInts) = 0;

    /**
     * Load the config ints, given in a previous input of the user.
     * @return A vector where the first int is bit array size (first int in the input), the rest are how many times to
     * run hash functions
     */
    virtual std::vector<int> loadConfigInts() = 0;

    /**
     * Get from the config the size of the bit array.
     * @return an int representing the bit array size
     */
    virtual int getBitSizeConfig() = 0;

    /**
     * Delete a given URL from the data source.
     * Default implementation is a runtime error of 'deletion of URLs is not supported'.
     * @param url a URL to be deleted
     * @return true if deleted successfully all URL instances in the data source, otherwise false.
     */
    virtual BloomFilterStatusEnum deleteUrl(const std::string& url) {
        throw std::runtime_error("deletion of URLs is not supported");
    }
};
#endif