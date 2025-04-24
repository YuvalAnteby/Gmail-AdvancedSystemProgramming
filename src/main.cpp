#include <iostream>
#include <sstream>
#include <cctype>
#include <algorithm>
#include <regex>

/**
 * Processes a line of input.
 * @param line line of the user's input
 * @return true if valid numbers were found and no invalid characters existed between them.
 * Otherwise, returns false, prints "FALSE"
 
bool processLine(const std::string& line) {
    std::istringstream iss(line);
    std::string token;
    bool hasDigits = false;
    std::vector<int> intsResult;
    while (iss >> token) {
        // Skip entire line if it starts with letters
        if (!hasDigits && std::any_of(token.begin(), token.end(), ::isalpha))
            return {};

        // If token is not all digits, it's invalid
        if (!std::all_of(token.begin(), token.end(), ::isdigit)) {
            std::cout << "false" << std::endl;
            return {};
        }

        hasDigits = true;
    }

    // If numbers were found, print newline and return true
    if (hasDigits) {
        std::cout << std::endl;
        return true;
    }

    // No numbers found, line is ignored
    return {};
}
/**
 * Check if the URL is valid using a basic regex pattern.
 * @param url string of a URL to be checked
 * @return true if the URL is of a valid regex
 
bool isValidURL(const std::string& url) {
    const std::regex pattern(R"(^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-z]{2,}([\/\w\.-])\/?$)");
    return std::regex_match(url, pattern);
}

/**
 * Check if all characters in the string are digits or whitespace.
 * @param line string of the user's choice of command & the url string
 * @return false if there is no alphabetic char or integer char in the current char of the string
 
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
 
bool hasValidCommandStructure(const std::string& line) {
    std::istringstream iss(line);
    std::string token;
    bool first = true;

    while (iss >> token) {
        if (!first && token != "1" && token != "2")
            return false;
        first = false;
    }

    return !first;
}

/**
 * Validate line before processing:
 * - Not empty
 * - Contains only digits/whitespace
 * - Valid command structure
 * @param line string of the user's choice of command & the url string
 * @return true if the line is valid (has choice & valid URL), otherwise false
 
bool isValidLine(const std::string& line) {
    return !line.empty() &&
           containsOnlyDigitsAndWhitespace(line) &&
           hasValidCommandStructure(line);
}

/**
 * Process a valid command line:
 * - If it starts with '1', add the URL
 * - If it starts with '2', check against the blacklist
 * @param line string of the user's choice of command & the url string
 * @param filter bloom filter object reference
 
void handleUserChoice(const std::string& line, BloomFilter& filter) {
    if (line.size() < 3) {
        std::cout << "false" << std::endl;
        return;
    }

    std::string url = line.substr(2);  // Extract URL after command and space

    if (!isValidURL(url)) {
        std::cout << "false" << std::endl;
        return;
    }

    if (line[0] == '1') {
        //filter.add(url);
        // TODO: insert new URL to filter here
    } else if (line[0] == '2') {
        // TODO: Roee's work here
    }
}
*/
/**
 * Main loop that reads and processes input lines.
 */
int main() {
 /**   // TODO: use here bloom filter object by Roee
    //BloomFilter filter;
    std::string line;
    bool firstLineFlag = true;
    while (std::getline(std::cin, line)) {
        // Skip to next line if the first line was invalid
        if (firstLineFlag && !processLine(line)) {
            continue;
        }
        firstLineFlag = false;
        if (isValidLine(line)) {
            handleUserChoice(line, filter);
        } else {
            std::cout << "false" << std::endl;
        }
    }
*/
    return 0;

}