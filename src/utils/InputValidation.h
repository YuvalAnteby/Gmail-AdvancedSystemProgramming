// Author(s): Dor Darmon, Yuval Anteby
#include "data_persistence/IDataPersistence.h"
#ifndef INPUT_VALIDATION_H
#define INPUT_VALIDATION_H

/**
 * Processes a line of input.
 * @param line line of the user's input
 * @return true if valid numbers were found and no invalid characters existed between them.
 * Otherwise, returns false, prints "FALSE"
 */
bool isValidFirstLine(const std::string& line);

/**
 * Check if the URL is valid using a basic regex pattern.
 * @param url string of a URL to be checked
 * @return true if the URL is of a valid regex
 */
bool isValidURL(const std::string& url);

/**
 * Check if all characters in the string are digits or whitespace.
 * @param line string of the user's choice of command & the url string
 * @return false if there is no alphabetic char or integer char in the current char of the string
 */
bool containsOnlyDigitsAndWhitespace(const std::string& line);

/**
 * Validate command structure.
 * The first token is ignored, all following tokens must be "1" or "2".
 * @param line string of the user's choice of command & the url string
 * @return true if the choice of the valid options (for now 1 or 2), otherwise false
 */
bool hasValidCommandStructure(const std::string& line);

/**
 * Check if the config ints given by user match the ones we have saved.
 * If we don't have config ints yet save the given ones.
 * @param firstInt first int in user's input, its the bit array size
 * @param configInts the rest of the ints in the user's input
 * @param persistence data source for the config ints
 */
bool isConfigMatching(int firstInt, std::vector<int> configInts, IDataPersistence& persistence);

/**
 * Validate line before processing:
 * - Not empty
 * - Contains only digits/whitespace
 * - Valid command structure
 * @param line string of the user's choice of command & the url string
 * @return true if the line is valid (has choice & valid URL), otherwise false
 */
bool isValidLine(const std::string& line);

#endif