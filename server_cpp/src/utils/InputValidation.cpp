// Author(s): Dor Darmon, Yuval Anteby
#include <iostream>
#include <cctype>
#include <algorithm>
#include <regex>
#include <sstream> // Required for istringstream
#include "data_persistence/IDataPersistence.h"

/**
 * Processes a line of input.
 * @param line line of the user's input
 * @return true if valid numbers were found and no invalid characters existed between them.
 * Otherwise, returns false, prints "FALSE"
 */
bool isValidFirstLine(const std::string& line) {
    std::istringstream iss(line);
    std::string token;
    bool hasDigits = false;
    std::vector<int> intsResult;
    while (iss >> token) {
        // Skip entire line if it starts with letters
        if (!hasDigits && std::any_of(token.begin(), token.end(), ::isalpha)) {
            return false;
        }
        // If token is not all digits, it's invalid
        if (!std::all_of(token.begin(), token.end(), ::isdigit)) {
            return false;
        }

        hasDigits = true;
    }

    return hasDigits;
}

/**
 * Check if the URL is valid using a basic regex pattern.
 * @param url string of a URL to be checked
 * @return true if the URL is of a valid regex
 */
bool isValidURL(const std::string& url) {
    if (url.empty()) {
        return false;
    }
    const std::regex pattern(R"(^((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,})(\/\S*)?$)");
    return std::regex_match(url, pattern);
}

/**
 * Check if all characters in the string are digits or whitespace.
 * @param line string of the user's choice of command & the url string
 * @return false if there is no alphabetic char or integer char in the current char of the string
 */
bool containsOnlyDigitsAndWhitespace(const std::string& line) {
    for (char c : line) {
        if (!std::isdigit(c) && !std::isspace(c))
            return false;
    }
    return true;
}

/**
 * Validate command structure.
 * The first token is ignored, all following tokens must be "1" or "2".
 * @param line string of the user's choice of command & the url string
 * @return true if the choice of the valid options (for now 1 or 2), otherwise false
 */
bool hasValidCommandStructure(const std::string& line) {
    std::istringstream iss(line);
    std::string command, url;
    if (!(iss >> command)) 
        return false;
    if (command != "1" && command != "2") 
        return false;
    if (!(iss >> url)) 
        return false; 
    return !url.empty();
} 

/**
 * Check if a given config is matching the one we have saved already. If there is no config saved - save the given one.
 * @param firstInt the bit array size
 * @param configInts array of config integers
 * @param persistence data source object
 * @return true if matching or if we saved the new config, otherwise false
 */
bool isConfigMatching(int firstInt, std::vector<int> configInts, IDataPersistence& persistence) {
    int loadedFirstInt = persistence.getBitSizeConfig();
    std::vector<int> loadedConfigInts = persistence.loadConfigInts();
    if (loadedFirstInt == -1 || loadedConfigInts.empty()) {
        std::vector<int> insertConfing = {firstInt};
        insertConfing.insert(insertConfing.end(), configInts.begin(), configInts.end());
        persistence.appendConfigInts(insertConfing);
        return true;
    }
    return (loadedFirstInt == firstInt) && (configInts == loadedConfigInts);
}

/**
 * Validates and parses CLI arguments for server configuration.
 * @param argc number of command-line arguments
 * @param argv array of command-line arguments
 * @param port port number (output)
 * @param bloomSize Bloom filter size (output)
 * @param hashMods vector of hash function mod values (output)
 * @return true if all arguments are valid, false otherwise.
 */
bool validateAndParseArgs(int argc, char* argv[], int& port, int& bloomSize, std::vector<int>& hashMods) {
    if (argc < 4) {
        std::cerr << "Usage: ./server <port> <bloom_size> <hash1> [<hash2> ... <hashN>]\n";
        return false;
    }

    std::string portStr(argv[1]);
    if (!std::all_of(portStr.begin(), portStr.end(), ::isdigit)) {
        std::cerr << "Error: Port must be a positive integer.\n";//TODO: dont print this is just for tests
        return false;
    }
    port = std::stoi(portStr);
    if (port < 1024 || port > 65535) {
        std::cerr << "Error: Port must be in range 1024–65535.\n";//TODO: dont print this is just for tests
        return false;
    }

    std::string bloomSizeStr(argv[2]);
    if (!std::all_of(bloomSizeStr.begin(), bloomSizeStr.end(), ::isdigit)) {
        std::cerr << "Error: Bloom filter size must be a positive integer.\n";//TODO: dont print this is just for tests
        return false;
    }
    bloomSize = std::stoi(bloomSizeStr);
    if (bloomSize <= 0) {
        std::cerr << "Error: Bloom filter size must be greater than 0.\n";//TODO: dont print this is just for tests
        return false;
    }

    for (int i = 3; i < argc; ++i) {
        std::string modStr(argv[i]);
        if (!std::all_of(modStr.begin(), modStr.end(), ::isdigit)) {
            std::cerr << "Error: Hash mod value '" << modStr << "' is not a positive integer.\n";//TODO: dont print this is just for tests
            return false;
        }
        int mod = std::stoi(modStr);
        if (mod <= 0) {
            std::cerr << "Error: Hash mod value must be greater than 0.\n";//TODO: dont print this is just for tests
            return false;
        }
        hashMods.push_back(mod);  
    }

    return true;
}
