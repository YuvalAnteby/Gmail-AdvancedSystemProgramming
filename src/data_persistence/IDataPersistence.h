// Author(s): Yuval Anteby
#ifndef IFILE_PERSISTENCE_H
#define IFILE_PERSISTENCE_H
#include <vector>
#include <string>
/**
 * Interface for file management of Bloom Filter.
 * 
 * Allows loading and saving bit arrays and blacklisted URLs.
 * Implemenations can store the data in various ways (e.g. file, DB etc.)
 */
class IDataPersistence {
public:

    virtual ~IDataPersistence() = default;

    /**
     * Load the bit array which represents the Bloom Filter.
     * @param vector of bit array to save.
     */
    virtual void appendBitArray(const std::vector<bool>& bits) = 0;

    /**
     * Load the entire bits arrays which represents the Bloom Filter.
     * @return A vector of a vector of bools, each element represents a bit array.
     */
    virtual std::vector<std::vector<bool>> loadBitArrays() = 0;

    /**
     * Save the blacklisted URL to file
     * @param urls The URL to save.
     */
    virtual void appendBlacklistedUrl(const std::string& url) = 0;

    /**
     * Load the list of blacklisted URLs (used for false-positive checks).
     * @return A vector of blacklisted URLs.
     */
    virtual std::vector<std::string> loadBlacklist() = 0;

    // TODO: a function to check if a bit array/ string exists in file - true/false only
    // TODO: a function to search for a specific bit array/ string in file - returns only this one if exists. otherwise null
};
#endif