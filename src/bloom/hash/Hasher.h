#ifndef HASHER_H
#define HASHER_H

#include <string>
#include <vector>

/**
 * @class Hasher
 * A class that performs recursive hashing on a base string value.
 * This class allows repeated application of std::hash on a given base string.
 * It is useful when simulating Bloom filter behavior or when applying multiple
 * hash functions by iterating a single hash function multiple times.
 */
class Hasher {
public:
    /**
     * @brief Constructs a Hasher with the given base string.
     * @param base The string to be used as the initial input for hashing.
     */
    Hasher(const std::string& base);

    /**
     * Computes the hash value of the base string after applying the hash function n times.
     *
     * For example:
     * - hashN(1) = hash(base)
     * - hashN(2) = hash(hash(base))
     * - hashN(3) = hash(hash(hash(base)))
     *
     * @param n The number of times to apply the hash function.
     * @return The final hash value after n recursive hash applications.
     */
    size_t hashN(int n) const;

    std::vector<bool> buildHashedArray(const std::string& url, int size, const std::vector<int>& counts);

private:
    std::string baseValue; ///< The base string used for hashing.
};

#endif // HASHER_H
