#include <gtest/gtest.h>
#include <string>
#include <sstream>
#include "utils/BloomInputProccesor.h"

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
