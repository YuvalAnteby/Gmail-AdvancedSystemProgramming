// Author(s): Yuval Anteby

#include "bloom/utils/BloomFilterStatusEnum.h"
#include "FilePersistence.h"
#include <fstream>
#include <iostream>
#include <utils/InputValidation.h>

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
 * @return true if added successfully, otherwise false
 */
bool FilePersistence::appendBitArray(const std::vector<bool> &bits) {
    //std::cout << "DEBUG: started appending bit array" << std::endl; //TODO: remove debug print
    // If the input is empty, throw an exception - invalid argument
    if (bits.empty()) {
        return false;
    }

    std::ofstream file(bitArrayPath.c_str(), std::ios::app);
    if (!file.is_open()) {
        return false;
    }
    // Convert each bool to 1/0 chars and add to the file
    for (bool bit : bits) {
        file << (bit ? '1' : '0');
    }
    // End the line (new bit array)
    file << '\n';
    //std::cout << "DEBUG: finished appending bit array" << std::endl; //TODO: remove debug print
    file.close();
    return true;
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
 * @param URLs The URL to save.
 * @return true if added successfully, otherwise false
 */
bool FilePersistence::appendBlacklistedUrl(const std::string &url) {
    //std::cout << "DEBUG: started appending URL" << std::endl; //TODO: remove debug print
    // If the input is empty, throw an exception - invalid argument
    if (url.empty()) {
        return false;
    }

    std::ofstream file(blacklistPath.c_str(), std::ios::app);
    if (!file.is_open()) {
        return false;
    }
    file << url;
    // End the line (new URL)
    file << '\n';
    file.close();
    //std::cout << "DEBUG: finished appending URL" << std::endl; //TODO: remove debug print
    return true;
}

/**
 * Save the config ints, given by the user's input.
 * @return int array of how many times to run hash functions. if there are no ints saved will return empty vector
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
    // Skip the first line (the bit array size)
    std::getline(file, line);
    // Get the ints
    while (std::getline(file, line)) {
        loadedConfigInts.push_back(std::stoi(line));
    }
    file.close();
    return loadedConfigInts;
}

/**
* Load the config ints, given in a previous input of the user.
* @param A vector where the first int is bit array size (first int in the input), the rest are how many times to run
* hash functions
* @return true if added successfully, otherwise false
*/
bool FilePersistence::appendConfigInts(const std::vector<int>& configInts) {
    //std::cout << "DEBUG: started appending config ints" << std::endl; //TODO: remove debug print
    // If the input is empty, throw an exception - invalid argument
    if (configInts.empty()) {
        return false;
    }
    
    std::ofstream file(configIntsPath.c_str(), std::ios::app);
    if (!file.is_open()) {
        return false;
    }
    for (int num : configInts) {
        file << num;
        // End the line (new number)
        file << '\n';
    }
    file.close();
    //std::cout << "DEBUG: finished appending config ints" << std::endl; //TODO: remove debug print
    return true;
}

/**
* Get from the config the size of the bit array.
* @return an int representing the bit array size. If there is no int saved returns -1
*/
int FilePersistence::getBitSizeConfig() {
    std::ifstream file(configIntsPath.c_str());
    // If the file doesn't exist, create it and return an empty file.
    if (!file.is_open()) {
        std::ofstream createFile(configIntsPath.c_str());
        return -1;
    }
    // Get the first int from the file
    std::string line;
    std::getline(file, line);
    int result = std::stoi(line);
    file.close();
    return result;
}

/**
 * Delete a given URL from the .txt file.
 * @param url a URL to be deleted
 * @return NO_CONTENT (204) if deleted successfully, NOT_FOUND (404) if URL doesn't exist, otherwise BAD_REQUEST (400)
 */
BloomFilterStatusEnum FilePersistence::deleteUrl(const std::string &url) {
    const std::string tempPath = "data/temp.txt";
    // set flag if we found & deleted at least one URL
    bool deleted = false;
    // Check validation of the URL
    if (url.empty() || !isValidURL(url)) {
        return BAD_REQUEST;
    }
    // Created a temp file, make sure both files opened correctly
    std::ifstream originalFile(blacklistPath.c_str());
    std::ofstream tempFile(tempPath, std::ios::app);
    if (!originalFile.is_open() || !tempFile.is_open()) {
        return BAD_REQUEST;
    }
    std::string line;
    // Loop through the original file, remove any instance of the given URL, move the rest to temp file
    while (std::getline(originalFile, line)) {
        if (line == url) {
            deleted = true;
        } else {
            tempFile << line << std::endl;
        }
    }
    tempFile.close();
    originalFile.close();
    // Didn't find the URL in file
    if (!deleted) {
        std::remove(tempPath.c_str());
        return NOT_FOUND;
    }
    // We deleted the URL, now replace the temp file to be the new original file
    std::remove(blacklistPath.c_str());
    std::rename(tempPath.c_str(), blacklistPath.c_str());
    return NO_CONTENT;
}
