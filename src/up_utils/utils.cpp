#include "utils.h"
#include <iostream>
#include <sstream>
#include <regex>
#include <cctype>

/**
 * This function checks if the given URL is valid using a regular expression.
 * The regex allows an optional "http://" or "https://", a possible "www.", 
 * and ensures the domain name follows a pattern of alphanumeric characters or hyphens.
 * @param url The URL string to be checked for validity.
 * @return true if the URL matches the regex pattern; otherwise, false.
 */
bool isValidURL(const std::string& url) {
    const std::regex pattern(
        R"(^((http|https):\/\/)?(www\.)?[a-zA-Z0-9\-\.]+\.[a-zA-Z0-9]{2,}([\/\w\.\-]*)\/?$)"
    );
    return std::regex_match(url, pattern);  // Check if the URL matches the regex pattern
}

/**
 * This function processes a line and checks if it only contains digits.
 * If there is any non-digit character in the line, it returns false. Otherwise, it returns true.
 * @param line The input line to be processed.
 * @return true if the line only contains digits; otherwise, false.
 */
bool processLine(const std::string& line) {
    std::istringstream iss(line);  // Parse the line character by character
    std::string token;
    bool hasDigits = false;
    
    // Loop through each token in the line and check if it is a number
    while (iss >> token) {
        // If no digits have been found yet, and the token contains any alphabetic character, return false
        if (!hasDigits && std::any_of(token.begin(), token.end(), ::isalpha))
            return false;
        // If the token contains any non-digit characters, return false
        if (!std::all_of(token.begin(), token.end(), ::isdigit)) {
            std::cout << "false" << std::endl; 
            return false;
        }
        hasDigits = true;
    }
    return true;
}

/**
 * This function checks if the line contains only "1" or "2" after the first token.
 * The line must not be empty, and it should include "1" or "2" after the initial token.
 * @param line The input line to be checked.
 * @return true if the line follows the correct structure; otherwise, false.
 */
bool isValidLine(const std::string& line) {
    if (line.empty())  // Return false if the line is empty
        return false;
    
    std::istringstream iss(line);
    std::string token;
    bool first = true;
    
    // If a token is found after the first one, only "1" or "2" are allowed
    while (iss >> token) {
        if (!first && token != "1" && token != "2")
            return false;  // Return false if token is not "1" or "2"
        first = false;  // Set first to false after processing the first token
    }
    return true;  // Return true if the line follows the correct structure
}

/**
 * This function handles the user's choice. If there is an error in the input or if the URL is invalid, 
 * it prints "false". If the URL is valid, it either adds it to the system or checks its existence.
 * @param line The input line containing the command and URL.
 */
void handleUserChoice(const std::string& line) {
    // If the input is shorter than 3 characters, it cannot be processed
    if (line.size() < 3) {
        std::cout << "false" << std::endl;
        return;
    }

    std::string url = line.substr(2);  // Extract the URL after the command and space

    // Check if the URL is valid
    if (!isValidURL(url)) {
        std::cout << "false" << std::endl;
        return;
    }

    // If the command is "1", add the URL to the system
    if (line[0] == '1') {
        std::cout << "URL added: " << url << std::endl;
        // TODO: Add the URL to the system here
    }
    // If the command is "2", check if the URL exists in the system
    else if (line[0] == '2') {
        std::cout << "Checking URL: " << url << std::endl;
        // TODO: Implement the check for the URL here
    }
}