#include "Hasher.h"
#include <functional>  // std::hash
#include <string>      // std::to_string

// Constructor that stores the base string
Hasher::Hasher(const std::string& base) : baseValue(base) {}

// Applies std::hash recursively n times starting from the base string.
// Each hash is computed on the stringified result of the previous hash.
size_t Hasher::hashN(int n) const {
    std::hash<std::string> hasher;
    size_t currentHash = hasher(baseValue); // First hash on base string

    // Repeat hashing (n - 1) times using the stringified hash as input
    for (int i = 1; i < n; ++i) {
        currentHash = hasher(std::to_string(currentHash));
    }

    return currentHash;
}
/**
 * Builds a binary array of given size where specific indices are set to 1.
 * For each number 'n' in the input vector, it performs n-times recursive hashing
 * on the URL and maps the result to an index using modulo. That index is then
 * marked as 1 in the result array.
 * This simulates behavior similar to one step of a Bloom filter.
 * @param url The input string to be hashed repeatedly.
 * @param size The size of the result array.
 * @param counts A vector containing how many times to hash the URL for each entry.
 * @return A binary array where some positions are set to 1 based on hashed indices.
*/
std::vector<bool> buildHashedArray(const std::string& url, int size, const std::vector<int>& counts) {
    std::vector<bool> result(size, 0);
    Hasher hasher(url);

    for (int count : counts) {
        size_t hashed = hasher.hashN(count);
        int index = hashed % size;
        result[index] = true;
    }

    return result;
}
