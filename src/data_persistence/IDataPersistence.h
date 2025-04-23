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
     * Save the blacklisted URL.
     * @param urls The URL to save.
     */
    virtual void appendBlacklistedUrl(const std::string& url) = 0;

    /**
     * Load the list of blacklisted URLs (used for false-positive checks).
     * @return A vector of blacklisted URLs.
     */
    virtual std::vector<std::string> loadBlacklist() = 0;
    

    /**
     * Save the config ints, given by the user's input.
     * @param vector first int is bit array size (first int in the input), the rest are how many times to run hash function
     */
    virtual void appendConfigInts(const std::vector<int>& configInts) = 0;

    /**
     * Load the config ints, given in a previous input of the user.
     * @return A vector where the first int is bit array size (first int in the input), the rest are how many times to run hash function
     */
    virtual std::vector<int> loadConfigInts() = 0;
};
#endif