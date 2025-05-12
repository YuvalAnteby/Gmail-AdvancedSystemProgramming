// Author(s): Dor Darmon, Yuval Anteby

#ifndef INPUT_VALIDATION_H
#define INPUT_VALIDATION_H

#include <string>
#include <vector>
#include "data_persistence/IDataPersistence.h"

/**
 * Processes a line of input.
 * @param line line of the user's input
 * @return true if valid numbers were found and no invalid characters existed between them.
 * Otherwise, returns false
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
 * @return false if there is a non-digit non-whitespace character
 */
bool containsOnlyDigitsAndWhitespace(const std::string& line);

/**
 * Validate command structure.
 * The first token is expected to be "1" or "2", followed by a valid URL.
 * @param line string of the user's command input
 * @return true if format is correct, otherwise false
 */
bool hasValidCommandStructure(const std::string& line);

/**
 * Check if the config ints given by user match the ones we have saved.
 * If we don't have config ints yet, save the given ones.
 * @param firstInt first int in user's input, its the bit array size
 * @param configInts the rest of the ints in the user's input
 * @param persistence data source for the config ints
 * @return true if matching or saved successfully, otherwise false
 */
bool isConfigMatching(int firstInt, std::vector<int> configInts, IDataPersistence& persistence);

/**
 * Validate that a port string is numeric and in range 1024–65535.
 * If valid, writes parsed value to the `port` reference.
 * @param portStr the port string from argv
 * @return true if valid
 */
bool isValidPort(const std::string& portStr);

/**
 * Validate that a bloom size string is numeric and > 0.
 * If valid, writes parsed value to the `bloomSize` reference.
 * @param bloomSizeStr the bloom size string from argv
 * @return true if valid
 */
bool isValidBloomSize(const std::string& bloomSizeStr);

/**
 * Validates and extracts hash mod values from CLI args starting at index 3.
 * If all values are valid (positive integers), writes them to `hashMods` reference vector.
 * @param argc number of args
 * @param argv array of args
 * @return true if all are valid
 */
bool isValidHashMods(int argc, char* argv[]);

/**
 * Validate and parse server startup arguments.
 * This is the main interface function to be called from main().
 * Internally uses other helper validation functions to avoid God function design.
 *
 * - If all arguments are valid, parsed values are written into the referenced parameters.
 * - Parameters are passed by reference so the original variables get updated.
 *
 * @param argc number of CLI arguments
 * @param argv array of CLI argument strings
 * @return true if valid, false otherwise
 */
bool isValidArgs(int argc, char* argv[]);

#endif 