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
