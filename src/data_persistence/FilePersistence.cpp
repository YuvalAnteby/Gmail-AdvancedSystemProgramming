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
    while(std::getline(file, line)) {
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

void FilePersistence::appendBitArray(const std::vector<bool>& bits) {
    // If the input is empty, throw an exception - invalid argument
    if (bits.empty()) {
        throw std::invalid_argument("Can't add an empty bit array");
    }

    std::ofstream file(bitArrayPath.c_str(), std::ios::app);
    // Convert each bool to 1/0 chars and add to the file
    for (bool bit: bits) {
        file << (bit ? '1' : '0');
    }
    // End the line (new bit array)
    file << '\n';
    file.close();
}

bool FilePersistence::isBitArrayInBloomFilter(const std::vector<bool>& bits) {
    std::ifstream file(bitArrayPath.c_str());
    if (!file.is_open()) {
        std::ofstream createFile(bitArrayPath.c_str());
        return false;
    }
    std::string line;
    while(std::getline(file, line)) {
        std::vector<bool> fileBits;
        // Convert each character in the line to a boolean value representing 1,0
        for (char c : line) {
            fileBits.push_back(c == '1');
        }
        // Check if the given bits array is equal to a bit array from the file, if it is return true
        if(bits == fileBits) {
            return true;
        }
    }
    file.close();
    return false;
}

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

void FilePersistence::appendBlacklistedUrl(const std::string& url) {
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

bool FilePersistence::isUrlBlacklisted(const std::string& url) {
    std::ifstream file(blacklistPath.c_str());
    // If the file doesn't exist, create it and return an empty file.
    if (!file.is_open()) {
        std::ofstream createFile(blacklistPath.c_str());
        return false;
    }
    // Read from the file
    std::string line;
    while (std::getline(file, line)) {
        // Check if the given URL is equal to a URL from the file, if it is return true
        if(url == line) {
            return true;
        }
    }
    file.close();
    return false;
}