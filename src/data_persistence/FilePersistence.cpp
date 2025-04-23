// Author(s): Yuval Anteby
#include "FilePersistence.h"
#include <fstream>
#include <iostream>

/**
 * Constructor
 */
FilePersistence::FilePersistence() {
    // Create the data folder in case it doesn't exist yet
    std::system("mkdir -p data");
}

/**
 * Load the entire bits arrays which represents the Bloom Filter.
 * @return A vector of a vector of bools, each element represents a bit array.
 */
std::vector<std::vector<bool>> FilePersistence::loadBitArrays() {
    std::ifstream file(bitArrayPath.c_str());
    // If the file doesn't exist, create it and return an empty file.
    if (!file.is_open()) {
        std::ofstream createFile(bitArrayPath.c_str());
        return {};
    }
    // Read from the file and convert to the correct variable type (from a string)
    std::vector<std::vector<bool>> loadedBitsArrays;
    std::string line;
    while (std::getline(file, line)) {
        std::vector<bool> bitsArray;
        // Convert each character in the line to a boolean value representing 1,0
        for (char c : line) {
            bitsArray.push_back(c == '1');
        }
        loadedBitsArrays.push_back(bitsArray);
    }
    file.close();
    return loadedBitsArrays;
}

/**
 * Insert the new bit array to the .txt file.
 * @param vector of bit array to save.
 */
void FilePersistence::appendBitArray(const std::vector<bool> &bits) {
    // If the input is empty, throw an exception - invalid argument
    if (bits.empty()) {
        throw std::invalid_argument("Can't add an empty bit array");
    }

    std::ofstream file(bitArrayPath.c_str(), std::ios::app);
    // Convert each bool to 1/0 chars and add to the file
    for (bool bit : bits) {
        file << (bit ? '1' : '0');
    }
    // End the line (new bit array)
    file << '\n';
    file.close();
}

/**
 * Load the list of blacklisted URLs (used for false-positive checks) from the .txt file.
 * @return A vector of blacklisted URLs.
 */
std::vector<std::string> FilePersistence::loadBlacklist() {
    std::ifstream file(blacklistPath.c_str());
    // If the file doesn't exist, create it and return an empty file.
    if (!file.is_open()) {
        std::ofstream createFile(blacklistPath.c_str());
        return {};
    }
    // Read from the file
    std::vector<std::string> loadedUrls;
    std::string line;
    while (std::getline(file, line)) {
        loadedUrls.push_back(line);
    }
    file.close();
    return loadedUrls;
}

/**
 * Insert the blacklisted URL to the .txt file.
 * @param urls The URL to save.
 */
void FilePersistence::appendBlacklistedUrl(const std::string &url) {
    // If the input is empty, throw an exception - invalid argument
    if (url.empty()) {
        throw std::invalid_argument("Can't add an empty string URL");
    }

    std::ofstream file(blacklistPath.c_str(), std::ios::app);
    file << url;
    // End the line (new URL)
    file << '\n';
    file.close();
}

/**
 * Save the config ints, given by the user's input.
 * @param vector first int is bit array size (first int in the input), the rest are how many times to run hash function
 */
std::vector<int> FilePersistence::loadConfigInts() {
    std::ifstream file(configIntsPath.c_str());
    // If the file doesn't exist, create it and return an empty file.
    if (!file.is_open()) {
        std::ofstream createFile(configIntsPath.c_str());
        return {};
    }
    // Read from the file and convert to the correct variable type (from a string)
    std::vector<int> loadedConfigInts;
    std::string line;
    while (std::getline(file, line)) {
        loadedConfigInts.push_back(std::stoi(line));
    }
    file.close();
    return loadedConfigInts;
}

/**
* Load the config ints, given in a previous input of the user.
* @return A vector where the first int is bit array size (first int in the input), the rest are how many times to run hash function
*/
void FilePersistence::appendConfigInts(const std::vector<int>& configInts) {
    // If the input is empty, throw an exception - invalid argument
    if (configInts.empty()) {
        throw std::invalid_argument("Can't add an empty config array");
    }

    std::ofstream file(configIntsPath.c_str(), std::ios::app);
    
    for (int num : configInts) {
        file << num;
        // End the line (new number)
        file << '\n';
    }
    file.close();
}
