
#include "BloomFilter.h"
#include "data_persistence/FilePersistence.h"
#include <iostream>
#include <sstream>

int main() {
    size_t size;
    int numHashes;

    // Receive the initial configuration (array size and number of hash functions)
    std::string firstLine;
    std::getline(std::cin, firstLine);
    std::istringstream configStream(firstLine);
    configStream >> size >> numHashes;

    // Check if the number of hashes is valid (should be 1 or 2)
    if (numHashes != 1 && numHashes != 2) {
        std::cout << "false" << std::endl;
        return 0;
    }

    // Create an instance of the FilePersistence class
    FilePersistence persistence;
    
    // Create a BloomFilter instance with the given size and number of hash functions
    BloomFilter filter(size, numHashes, &persistence);

    // Load any existing data from the file system into the Bloom filter
    filter.loadExistingData();

    std::string line;
    while (true) {
        std::getline(std::cin, line);

        // If the line contains a new configuration (size and number of hash functions), update the configuration
        std::istringstream newConfigStream(line);
        size_t newSize;
        int newNumHashes;
        if (newConfigStream >> newSize >> newNumHashes) {
            // Ensure that the number of hash functions is valid (1 or 2)
            if (newNumHashes != 1 && newNumHashes != 2) {
                std::cout << "false" << std::endl;
                continue; 
            }
            // Update the configuration with the new size and number of hash functions
            filter.updateConfig(newSize, newNumHashes);
            continue;
        }

        // If the line is too short or doesn't start with 1 or 2, print false and continue
        if (line.length() < 3 || (line[0] != '1' && line[0] != '2') || line[1] != ' ') {
            std::cout << "false" << std::endl;
            continue;
        }

        // Extract the URL , skip the first 2 characters, which are the number and spac. 
        std::string url = line.substr(2);
        
        ///TODO: Continue writing them in a folder. (yuval)
        // If the input starts with '1', add the URL to the filter
        if (line[0] == '1') {
            filter.add(url);
        } 
        ///TODO: Change the second according to the rules in the exercise.(ROI)
        // If the input starts with '2', check if the URL might be blacklisted
        else if (line[0] == '2') {
            bool maybe = filter.mightContain(url);
            if (!maybe) {
                std::cout << "false" << std::endl;
            } else {
                // Verify if the URL is actually blacklisted
                bool really = filter.isReallyBlacklisted(url);
                std::cout << "true " << (really ? "true" : "false") << std::endl;
            }
        }
    }

    return 0;
}
