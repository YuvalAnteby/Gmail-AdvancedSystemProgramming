#include <gtest/gtest.h>
#include "math.h"
/*
TEST(AdditionTest, PositiveNumbers) {
    EXPECT_EQ(add(1, 2), 3);
}*/

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    std::cout << "HHHH";
    return RUN_ALL_TESTS();
}
/**
 *  Test that a 'check' operation before any configuration or blacklist entries
 *  has been made, returns "false" and does not crash the program.
*/
TEST_F(MainAppTest, CheckBeforeConfig)
{
    std::istringstream input("2 www.site.com\n");
    std::ostringstream output;

    runBloomApp(input, output);
    EXPECT_EQ(output.str(), "false\n");
}
/**
 * Test that an unrecognized or garbage line in the input is ignored,
 * while (output.str().find("true") != std::string::npos) and 
 * valid commands afterward are processed correctly.
*/
TEST_F(MainAppTest, GarbageLineIgnored)
{
    std::istringstream input("100 2\nblabla something wrong\n1 www.good.com\n2 www.good.com\n");
    std::ostringstream output;

    runBloomApp(input, output);
    EXPECT_EQ(output.str(), "true true\n");
}

// Test checking URL that is not blacklisted
TEST_F(MainAppTest, CheckNonBlacklistedUrl)
{
    std::istringstream input("100 2\n2 www.notblacklisted.com\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

// Test switching to invalid configuration during runtime
TEST_F(MainAppTest, InvalidConfigMidRun)
{
    std::istringstream input("100 1\n200 4\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

// Test malformed input line
TEST_F(MainAppTest, InvalidInputLine)
{
    std::istringstream input("100 2\nx y z\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

// Test empty line
TEST_F(MainAppTest, EmptyInputLine)
{
    std::istringstream input("100 2\n\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

/**
 * Test that multiple URLs can be added to the blacklist, and each is recognized
 * correctly when checked later.
 * In this case, the program should return "true true" for each URL checked.
 */
TEST_F(MainAppTest, MultipleBlacklistEntries)
{
    std::istringstream input("150 2 1\n1 www.a.com\n1 www.b.com\n1 www.c.com\n"
                             "2 www.a.com\n2 www.b.com\n2 www.c.com\n");
    std::ostringstream output;

    runBloomApp(input, output);

    std::string result = output.str();
    EXPECT_TRUE(result.find("true true") != std::string::npos);
}

/**
 *  Test that the program might return "true false" for a false positive case:
 * In this case,the Bloom filter might match (true), but the actual list does not contain it (false).
 */
 TEST_F(MainAppTest, FalsePositiveDetection)
{
    std::istringstream input("100 2\n1 www.a.com\n2 www.b.com\n");
    std::ostringstream output;
    runBloomApp(input, output);

    std::string result = output.str();
    // Expected result: either definitely false, or a potential false positive
    EXPECT_TRUE(result == "false\n" || result == "true false\n");
}

