#include <gtest/gtest.h>
#include <string>
#include <sstream>
#include "data_persistence/FilePersistence.h"

#include "strategy_io/utils/BloomInputProccesor.h"

/**
 * Test: tests some basic examples of invalid first line. expecting to skip them and move to the correct one
 * Expecting to get the first int and the rest of the ints in different variables
 */
TEST(processFirstInt, ProccesingFirstValidLine) {
    std::string line = "8 1 2";
    std::string firstNum = processFirstInt(line);
    EXPECT_EQ(firstNum, "8");
    std::vector<int> configInts = processConfigInts(line);
    EXPECT_EQ(configInts, std::vector<int>({1, 2}));
}

/**
 * Test: Verifies that processInput correctly handles valid arguments for port, bloomSize, and hashMods.
 * It processes a valid set of arguments and ensures the correct values are assigned to the respective variables.
 * Expecting port=8080, bloomSize=1000, and hashMods={3, 5, 7}.
 */
TEST(ProcessInputTest, ValidArgs) {
    int port = 0;
    int bloomSize = 0;
    std::vector<int> hashMods;
    const char *argv[] = {"program_name", "8080", "1000", "3", "5", "7"};
    int argc = sizeof(argv) / sizeof(argv[0]);
    IDataPersistence *dataSource = new FilePersistence();
    // Process the arguments
    processInput(argc, const_cast<char **>(argv), port, bloomSize, hashMods, *dataSource);

    // Assert that port, bloomSize, and hashMods have been correctly set from the input arguments
    EXPECT_EQ(port, 8080); // Port should be 8080
    EXPECT_EQ(bloomSize, 1000); // Bloom size should be 1000
    EXPECT_EQ(hashMods.size(), 3); // Three hash mods should be set
    EXPECT_EQ(hashMods[0], 3); // First hash mod should be 3
    EXPECT_EQ(hashMods[1], 5); // Second hash mod should be 5
    EXPECT_EQ(hashMods[2], 7); // Third hash mod should be 7
}
