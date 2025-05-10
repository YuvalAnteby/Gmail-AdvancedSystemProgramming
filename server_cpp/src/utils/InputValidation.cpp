// Author(s): Dor Darmon, Yuval Anteby
#include <iostream>
#include <cctype>
#include <algorithm>
#include <regex>
#include <sstream>
#include "data_persistence/IDataPersistence.h"

/**
 * Checks if the input line contains only digits separated by spaces.
 * @param line The user input line.
 * @return True if valid, false otherwise.
 */
bool isValidFirstLine(const std::string& line) {
    std::istringstream iss(line);
    std::string token;
    bool hasDigits = false;

    while (iss >> token) {
        // Skip if token contains any letters
        if (!hasDigits && std::any_of(token.begin(), token.end(), ::isalpha)) {
            return false;
        }

        // Token must consist of digits only
        if (!std::all_of(token.begin(), token.end(), ::isdigit)) {
            return false;
        }

        hasDigits = true;
    }

    return hasDigits;
}

/**
 * Validates a URL using a regular expression.
 * @param url The string to validate.
 * @return True if the URL is valid.
 */
bool isValidURL(const std::string& url) {
    if (url.empty()) {
        return false;
    }
    const std::regex pattern(R"(^((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,})(\/\S*)?$)");
    return std::regex_match(url, pattern);
}

/**
 * Checks if a line contains only digits and whitespace.
 * @param line Input string.
 * @return True if valid, false otherwise.
 */
bool containsOnlyDigitsAndWhitespace(const std::string& line) {
    for (char c : line) {
        if (!std::isdigit(c) && !std::isspace(c))
            return false;
    }
    return true;
}

/**
 * no longer in use! keep it if we need it 
 * Checks command format: first token is 1 or 2, followed by a non-empty URL.
 * @param line Full user command input.
 * @return True if structure is valid.
 
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
*/
/**
 * Compares a given config with persisted config, or saves it if no config exists.
 * @param firstInt The bloom filter bit size.
 * @param configInts The vector of hash mod values.
 * @param persistence Persistence interface to load/save config.
 * @return True if matching or saved successfully, false if mismatch.
 */
bool isConfigMatching(int firstInt, std::vector<int> configInts, IDataPersistence& persistence) {
    int loadedFirstInt = persistence.getBitSizeConfig();
    std::vector<int> loadedConfigInts = persistence.loadConfigInts();

    if (loadedFirstInt == -1 || loadedConfigInts.empty()) {
        std::vector<int> insertConfig = {firstInt};
        insertConfig.insert(insertConfig.end(), configInts.begin(), configInts.end());
        persistence.appendConfigInts(insertConfig);
        return true;
    }

    return (loadedFirstInt == firstInt) && (configInts == loadedConfigInts);
}

/**
 * Validates and parses CLI arguments for server configuration.
 * @param argc Argument count.
 * @param argv Argument array.
 * @param port Output port.
 * @param bloomSize Output bloom size.
 * @param hashMods Output vector of hash mod values.
 * @return True if all arguments are valid.
 */
bool validateAndParseArgs(int argc, char* argv[], int& port, int& bloomSize, std::vector<int>& hashMods) {
    if (argc < 4) {
        std::cerr << "Usage: ./server <port> <bloom_size> <hash1> [<hash2> ... <hashN>]\n";
        return false;
    }

    if (!isValidPort(argv[1], port)) {
        return false;
    }

    if (!isValidBloomSize(argv[2], bloomSize)) {
        return false;
    }

    if (!isValidHashMods(argc, argv, hashMods)) {
        return false;
    }

    return true;
}

/**
 * Validates the given port string and converts it to an integer.
 * @param portStr Port argument from argv[1].
 * @param port Output integer to store the validated port.
 * @return True if valid (numeric and in range 1024–65535), false otherwise.
 */
bool isValidPort(const std::string& portStr, int& port) {
    if (!std::all_of(portStr.begin(), portStr.end(), ::isdigit)) {
        return false;
    }
    port = std::stoi(portStr);
    return port >= 1024 && port <= 65535;
}

/**
 * Validates the Bloom filter size argument and converts it to an integer.
 * @param sizeStr Bloom size argument from argv[2].
 * @param bloomSize Output integer to store the validated size.
 * @return True if valid (positive integer), false otherwise.
 */
bool isValidBloomSize(const std::string& sizeStr, int& bloomSize) {
    if (!std::all_of(sizeStr.begin(), sizeStr.end(), ::isdigit)) {
        return false;
    }
    bloomSize = std::stoi(sizeStr);
    return bloomSize > 0;
}

/**
 * Validates all hash mod arguments starting from argv[3] and fills the hashMods vector.
 * @param argc Total number of arguments.
 * @param argv Command-line argument array.
 * @param hashMods Output vector to store all hash mod integers.
 * @return True if all mod arguments are valid positive integers, false otherwise.
 */
bool isValidHashMods(int argc, char* argv[], std::vector<int>& hashMods) {
    for (int i = 3; i < argc; ++i) {
        std::string modStr(argv[i]);
        if (!std::all_of(modStr.begin(), modStr.end(), ::isdigit)) {
            return false;
        }

        int mod = std::stoi(modStr);
        if (mod <= 0) {
            return false;
        }

        hashMods.push_back(mod);
    }
    return true;
}