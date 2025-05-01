// Author(s): Dor Darmon, Yuval Anteby
#include <iostream>
#include <cctype>
#include <algorithm>
#include <regex>
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
            //std::cout << "----- DEBUG: isValidFirstLine? FALSE (has letters) -----" << std::endl; // TODO: remove debug print
            return false;
        }
        // If token is not all digits, it's invalid
        if (!std::all_of(token.begin(), token.end(), ::isdigit)) {
            //std::cout << "----- DEBUG: isValidFirstLine? FALSE (not all digits) -----" << std::endl; // TODO: remove debug print
            //std::cout << "false" << std::endl;
            return false;
        }

        hasDigits = true;
    }

    // If numbers were found, print newline and return true
    if (hasDigits) {
        //std::cout << std::endl;
        //std::cout << "----- DEBUG: isValidFirstLine? TRUE -----" << std::endl; // TODO: remove debug print
        return true;
    }
    //std::cout << "----- DEBUG: isValidFirstLine? FALSE (no numbers found) -----" << std::endl; // TODO: remove debug print
    // No numbers found, line is ignored
    return false;
}

/**
 * Check if the URL is valid using a basic regex pattern.
 * @param url string of a URL to be checked
 * @return true if the URL is of a valid regex
 */
bool isValidURL(const std::string& url) {
    //std::cout << "----- DEBUG: isValidURL -----" << std::endl; // TODO: remove debug print
    if(url.empty()) {
        return false;
    }
    const std::regex pattern(R"(^((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,})(\/\S*)?$)");
    //std::cout << "----- DEBUG: isValidURL? " << std::regex_match(url, pattern) << " -----" << std::endl; // TODO: remove debug print
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
            //std::cout << "----- DEBUG: containsOnlyDigitsAndWhitespace FALSE -----" << std::endl; // TODO: remove debug print
            return false;
    }
    //std::cout << "----- DEBUG: containsOnlyDigitsAndWhitespace TRUE -----" << std::endl; // TODO: remove debug print
    return true;
}

/**
 * Validate command structure.
 * The first token is ignored, all following tokens must be "1" or "2".
 * @param line string of the user's choice of command & the url string
 * @return true if the choice of the valid options (for now 1 or 2), otherwise false
 */
bool hasValidCommandStructure(const std::string& line) {
    //std::cout << "----- DEBUG: hasValidCommandStructure -----" << std::endl; // TODO: remove debug print
    std::istringstream iss(line);
    std::string command, url;
    // No command number was provided
    if (!(iss >> command)) 
        return false;
    // If the command doesnt start with 1 or 2 its invalid
    if (command != "1" && command != "2") 
        return false;
    // require at least a second token (the URL)
    if (!(iss >> url)) 
        return false; 
    if(url.empty()) {
        return false;
    }
    return true;
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
    if(loadedFirstInt == -1 || loadedConfigInts.empty()) {
        // There are no config ints saved, insert them now
        std::vector<int> insertConfing = {firstInt};
        insertConfing.insert(insertConfing.end(), configInts.begin(), configInts.end());
        persistence.appendConfigInts(insertConfing);
        return true;
    }
    if((loadedFirstInt != firstInt) || (configInts != loadedConfigInts)) {
        return false;
    }
    return true;
}