#include "Hasher.h"
#include <functional>  // std::hash
#include <string>      // std::to_string
#include <vector>      // std::vector

// Constructor that stores the base string
Hasher::Hasher(const std::string& base) : baseValue(base) {}

// Applies std::hash recursively n times starting from the base string.
size_t Hasher::hashN(int n) const {
    std::hash<std::string> hasher;
    size_t currentHash = hasher(baseValue); // First hash on base string

    // Repeat hashing (n - 1) times using the stringified hash as input
    for (int i = 1; i < n; ++i) {
        currentHash = hasher(std::to_string(currentHash));
    }

    return currentHash;
}

// Builds a binary array based on the URL, size, and counts
std::vector<bool> Hasher::buildHashedArray(const std::string& url, int size, const std::vector<int>& counts) {
    std::vector<bool> result(size, false);
    Hasher hasher(url);  // Create a Hasher object using the URL

    for (int count : counts) {
        size_t hashed = hasher.hashN(count);  // Apply hashN for each count
        int index = hashed % size;           // Use modulo to map to index
        result[index] = true;                // Set the index to true
    }

    return result;  // Return the populated binary array
}
