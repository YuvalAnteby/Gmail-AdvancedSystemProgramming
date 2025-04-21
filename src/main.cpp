
#include "BloomFilter.h"
#include "data_persistence/FilePersistence.h"
#include <iostream>
#include <sstream>
#include <sstream>
#include <iostream>
#include <cctype>

int main()
{
    size_t size;
    int numHashes;

    // Receive the initial configuration (array size and number of hash functions)
    std::string firstLine;
    std::getline(std::cin, firstLine);
    std::istringstream configStream(firstLine);
    configStream >> size >> numHashes;

    // Check if the number of hashes is valid (should be 1 or 2)
    if (numHashes != 1 && numHashes != 2)
    {
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
    while (true)
    {
        std::getline(std::cin, line);

        // If the line contains a new configuration (size and number of hash functions), update the configuration
        std::istringstream newConfigStream(line);
        size_t newSize;
        int newNumHashes;
        if (newConfigStream >> newSize >> newNumHashes)
        {
            // Ensure that the number of hash functions is valid (1 or 2)
            if (newNumHashes != 1 && newNumHashes != 2)
            {
                std::cout << "false" << std::endl;
                continue;
            }
            // Update the configuration with the new size and number of hash functions
            filter.updateConfig(newSize, newNumHashes);
            continue;
        }
        // Ensure the line is not empty and contains only digits
        if (
            !line.empty() && [](const std::string &l)
            {
                // Check if all characters in the line are digits
                for (char c : l)
                {
                    if (!isdigit(c))
                        return false; 
                }

                std::istringstream iss(l); 
                std::string token;
                bool first = true;

                // Iterate through each token in the string
                while (iss >> token)
                {
                    // After the first token, it must be '1' or '2'
                    if (!first && token != "1" && token != "2")
                        return false;

                    first = false;
                }

                // Return true only if there was at least one token after the first
                return !first; 
            }(line) 
        )
        {
            // Extract the URL , skip the first 2 characters, which are the number and spac.
            std::string url = line.substr(2);

            /// TODO: Continue writing them in a folder. (yuval)
            // If the input starts with '1', add the URL to the filter
            if (line[0] == '1')
            {
                filter.add(url);
            }
            /// TODO: Change the second according to the rules in the exercise.(ROI)
            // If the input starts with '2', check if the URL might be blacklisted
            else if (line[0] == '2')
            {
                bool maybe = filter.mightContain(url);
                if (!maybe)
                {
                    std::cout << "false" << std::endl;
                }
                else
                {
                    // Verify if the URL is actually blacklisted
                    bool really = filter.isReallyBlacklisted(url);
                    std::cout << "true " << (really ? "true" : "false") << std::endl;
                }
            }
        }
        else
        {
            std::cout << "false" << std::endl;
            continue;
        }

        return 0;
    }
