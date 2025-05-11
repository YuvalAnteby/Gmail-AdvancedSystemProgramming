// @Author(s): Yuval Anteby

#ifndef BLOOM_INPUT_PROCCESOR_H
#define BLOOM_INPUT_PROCCESOR_H

#include <vector>

#include "bloom/utils/CommandRequest.h"
#include "data_persistence/IDataPersistence.h"
#include "strategyIO/IOutputWriter.h"

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
 * Process the input arguments passed to the program and populate the relevant variables.
 * This function handles command-line arguments passed to the program, extracts the port, bloom size,
 * and hash mod values, then assigns them to the given references.
 * If any error occurs (invalid input or missing arguments), the program will exit.
 * @param argc number of command-line arguments.
 * @param argv array of command-line arguments.
 * @param port reference to an integer where the port value will be stored.
 * @param bloomSize reference to an integer where the bloom size will be stored.
 * @param hashMods reference to a vector where the hash mod values will be stored.
 */
void processInput(int argc, char* argv[], int& port, int& bloomSize, std::vector<int>& hashMods);


/**
 * Handle the user's choice of bloom filter command, initialize and execute the correct one, if given valid input.
 * @param arrSize bit array size given by the user
 * @param configInts the rest of the config integers for the hashing
 * @param commandReq object of a commands request, made of {command enum, string URL}
 * @param dataSource object of the data source to provide URLs, bits etc
 * @param outputWriter object responsible on output (e.g. output using a CLI or over a TCP socket)
 */
void handleBloomCommandChoice(
    int arrSize,
    const std::vector<int> &configInts,
    CommandRequest commandReq,
    IDataPersistence &dataSource,
    IOutputWriter &outputWriter
);

#endif
