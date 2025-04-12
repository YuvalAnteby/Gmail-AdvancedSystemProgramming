// author: Yuval Anteby
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
class IFilePersistence {
public:

    virtual ~IFilePersistence() = default;

    /**
     * Load the bit array which represents the Bloom Filter.
     * @param vector of bit array to save.
     */
    virtual void saveBitArray(const std::vector<bool>& bits) = 0;

    /**
     * Load the bit array which represents the Bloom Filter.
     * @return A vector of booleans, each represents a bit in the Bloom Filter.
     */
    virtual std::vector<bool> loadBitArray() = 0;

    /**
     * Save the list of blacklisted URLs.alignas
     * @param urls The list of URLs to save.
     */
    virtual void saveBlacklist(const std::vector<std::string>& urls) = 0;

    /**
     * Load the list of blacklisted URLs (used for false-positive checks).
     * @return A vector of blacklisted URLs.
     */
    virtual std::vector<std::string> loadBlacklist() = 0;
};
#endif