// @Author(s): Yuval Anteby

#ifndef BLOOM_INPUT_PROCCESOR_H
#define BLOOM_INPUT_PROCCESOR_H

#include <iostream>
#include <vector>
#include "data_persistence/IDataPersistence.h"

/**
 * Get the first number from the first line as a string, edit the line string to skip it.
 * @param line string of the user's input line. will be changed in function
 * @return string of the first number in the string (bit array size)
 */
std::string processFirstInt(std::string& line);

/**
 * Get the remaning ints from the user's first line of input, which contains ints only
 * @param newLine the line after removing the first int
 * @return vector of ints representing the ints from the user
 */
std::vector<int> processConfigInts(const std::string& newLine);

/**
 * Process a valid command line (after the initial line of ints):
 * - If it starts with '1', add the URL
 * - If it starts with '2', check against the blacklist
 * @param line string of the user's choice of command & the url string
 * @param firstInt bit array size given by the user
 * @param configInts the rest of the config integers for the hashing
 * @param dataSource object of the data source to provide URLs, bits etc
 */
void handleUserChoice(const std::string& line, int firstInt, std::vector<int> configInts, IDataPersistence& dataSource);

#endif
