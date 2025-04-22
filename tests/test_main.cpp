#include <gtest/gtest.h>
#include "math.h"

/**
 * Entry point for running all unit tests.
 */
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    std::cout << "HHHH";
    return RUN_ALL_TESTS();
}

/**
 * @test CheckBeforeConfig
 * Test that a 'check' operation before any configuration or blacklist entries
 * returns "false" and does not crash the program.
 */
TEST_F(MainAppTest, CheckBeforeConfig)
{
    std::istringstream input("2 www.site.com\n");
    std::ostringstream output;

    runBloomApp(input, output);
    EXPECT_EQ(output.str(), "false\n");
}

/**
 * @test GarbageLineIgnored
 * Test that an unrecognized or garbage line in the input is ignored,
 * and valid commands afterward are processed correctly.
 */
TEST_F(MainAppTest, GarbageLineIgnored)
{
    std::istringstream input("100 2\nblabla something wrong\n1 www.good.com\n2 www.good.com\n");
    std::ostringstream output;

    runBloomApp(input, output);
    EXPECT_EQ(output.str(), "true true\n");
}

/**
 * @test CheckNonBlacklistedUrl .
 * Test checking a URL that was never added to the blacklist.
 * Expected result is "false".
 */
TEST_F(MainAppTest, CheckNonBlacklistedUrl)
{
    std::istringstream input("100 2\n2 www.notblacklisted.com\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

/**
 * @test InvalidConfigMidRun
 * Test attempting to reconfigure the Bloom filter mid-execution
 * with invalid parameters. Expected to return "false". 
 */
TEST_F(MainAppTest, InvalidConfigMidRun)
{
    std::istringstream input("100 1\n200 4\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

/**
 * @test InvalidInputLine
 * Test malformed input lines with invalid format. Expected to be ignored
 * and not crash the system. Should return "false".
 */
TEST_F(MainAppTest, InvalidInputLine)
{
    std::istringstream input("100 2\nx y z\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

/**
 * @test EmptyInputLine
 * Test that an empty line in the input is safely ignored.
 * The program should handle it without crashing and return "false".
 */
TEST_F(MainAppTest, EmptyInputLine)
{
    std::istringstream input("100 2\n\n");
    std::ostringstream output;

    runBloomApp(input, output);
    std::string result = output.str();
    EXPECT_EQ(result, "false\n");
}

/**
 * @test MultipleBlacklistEntries
 * Test that multiple URLs can be added to the blacklist, and each is
 * recognized correctly when checked later.
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
 * @test FalsePositiveDetection
 * Test a case where a false positive might occur due to Bloom filter characteristics.
 * The program might return either "false" or "true false".
 */
TEST_F(MainAppTest, FalsePositiveDetection)
{
    std::istringstream input("100 2\n1 www.a.com\n2 www.b.com\n");
    std::ostringstream output;

    runBloomApp(input, output);

    std::string result = output.str();
    EXPECT_TRUE(result == "false\n" || result == "true false\n");
}
