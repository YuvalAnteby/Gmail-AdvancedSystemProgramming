#include <gtest/gtest.h>
#include <string>
#include <sstream>
#include "utils/InputValidation.h"

/**
 * Test: check if a first line is regarded as valid or invalid input with mixed words and numbers
 * Expected: getting false (invalid input)
 */
TEST(isValidFirstLine, FirstLineMixedWords) {
    std::string userLine = "1a b2 3c";
    EXPECT_FALSE(isValidFirstLine(userLine));
}

/**
 * Test: check if a first line is regarded as valid or invalid input with words only
 * Expected: getting false (invalid input)
 */
TEST(isValidFirstLine, FirstLineWordsOnly) {
    std::string userLine = "bla blu bli";
    EXPECT_FALSE(isValidFirstLine(userLine));
}

/**
 * Test: check if a first line is regarded as valid or invalid input with numbers only
 * Expected: getting true (valid input)
 */
TEST(isValidFirstLine, FirstLineNumbersOnly) {
    std::string userLine = "8 1 2";
    EXPECT_TRUE(isValidFirstLine(userLine));
}

/**
 * Test: check if several examples of valid URLs are indeed valid
 * Expected: getting true to every URL
 */
TEST(isValidURL, ValidUrlsOnly) {
    std::vector<std::string> urlsArray = {
        "www.example.com0",
        "www.example.com1",
        "www.example.com11",
        "www.example.com",
        "https://www.example.com",
        "http://www.example.com",
        "https://www.example.com1",
        "http://www.example.com1",
        "www.example.co.il",
        "www.example.org",
        "https://www.example.co.il",
        "http://www.example.co.il",
        "https://www.example.org",
        "http://www.example.org",
        "www.example.org1"
    };
    for(std::string url : urlsArray) {
        EXPECT_TRUE(isValidURL(url)) << "Unexpectedly failed: " << url;

    }
}

/**
 * Test: check if several examples of invalid URLs are indeed invalid
 * Expected: getting false to every URL
 */
TEST(isValidURL, InvalidUrlsOnly) {
    std::vector<std::string> urlsArray = {
        "example",
        "wwwexample",
        "examplecom",
        "www.example.1",
        "wwwexamplecom"
    };
    for(std::string url : urlsArray) {
        EXPECT_FALSE(isValidURL(url)) << "Unexpectedly passed: " << url;

    }
}

/**
 * Test: try invalid inputs like letters only, letters mixed with whitespaces, letters mixed with numbers etc
 * Expected: getting false to every input
 */
TEST(containsOnlyDigitsAndWhitespace, InvalidInputsDigitsWhitespaces) {
    std::vector<std::string> stringsArray = {
        "a",
        "aa",
        "aa ",
        "1aa",
        "aa1",
        "1a2",
        "@",
        "1@",
        " @"
    };
    for(std::string str : stringsArray) {
        EXPECT_FALSE(containsOnlyDigitsAndWhitespace(str));
    }
}

/**
 * Test: try valid inputs
 * Expected: getting true to every input
 */
TEST(containsOnlyDigitsAndWhitespace, ValidInputsDigitsWhitespaces) {
    std::vector<std::string> stringsArray = {
        "1",
        "11",
        "111",
        "11 22 33",
        "22 ",
        " 22",
        " 22 "
    };
    for(std::string str : stringsArray) {
        EXPECT_TRUE(containsOnlyDigitsAndWhitespace(str));
    }
}

/**
 * not in use for now
 * Test: try valid commands structures
 * Expected: getting true to every input

TEST(hasValidCommandStructure, ValidCommands) {
    std::vector<std::string> commandLines = {
        "1 www.example.com",
        "2 www.example.com",
        "1 www.example.com1",
        "2 www.example.com1",
    };
    for(std::string str : commandLines) {
        EXPECT_TRUE(hasValidCommandStructure(str));
    }
}
 */
/**
 * for now not in use
 * Test: try valid commands structures
 * Expected: getting true to every input

TEST(hasValidCommandStructure, InvalidCommands) {
    std::vector<std::string> commandLines = {
        "3 www.example.com",
        "www.example.com",
        " www.example.com1",
        "www.example.com1 ",
        " www.example.com1 ",
        "- www.example.com1",
        "a www.example.com1",
    };
    for(std::string str : commandLines) {
        EXPECT_FALSE(hasValidCommandStructure(str));
    }
}
 */

/**
 * Test: Verifies that validateAndParseArgs works correctly when all arguments are valid.
 * When the input has the correct number of arguments and all values are valid, the function should return true.
 * Expecting the function to return true for valid args.
 */
TEST(isValidArgs, ValidArgsCount) {
    const char* argv[] = {"program_name", "8080", "1000", "3", "5", "7"};
    int argc = sizeof(argv) / sizeof(argv[0]);

    // Validate and parse the arguments
    bool result = isValidArgs(argc, const_cast<char**>(argv));

    // Assert that the function returns true for valid arguments
    EXPECT_TRUE(result);  // The function should return true for valid input
}

/**
 * Test: Verifies that validateAndParseArgs returns false when the number of arguments is insufficient.
 * If the input is missing essential arguments, the function should return false.
 * Expecting false for this test case due to missing hash mods.
 */
TEST(isValidArgs, InvalidArgsCount) {
    const char* argv[] = {"program_name", "8080", "1000"};
    int argc = sizeof(argv) / sizeof(argv[0]);

    // Validate and parse the arguments
    bool result = isValidArgs(argc, const_cast<char**>(argv));

    // Assert that the function returns false due to insufficient arguments
    EXPECT_FALSE(result);  // The function should return false for insufficient arguments
}

/**
 * Test: Verifies that validateAndParseArgs returns false if the port is non-numeric.
 * The port should be an integer; if it's not, the function should return false.
 * Expecting false for this test case due to an invalid port.
 */
TEST(isValidArgs, InvalidPort) {
    const char* argv[] = {"program_name", "invalidPort", "1000", "3", "5", "7"};
    int argc = sizeof(argv) / sizeof(argv[0]);

    // Validate and parse the arguments with an invalid port value
    bool result = isValidArgs(argc, const_cast<char**>(argv));

    // Assert that the function returns false due to the invalid port
    EXPECT_FALSE(result);  // The function should return false for an invalid port
}

/**
 * Test: Verifies that validateAndParseArgs returns false if the bloom size is non-numeric.
 * The bloom size should be an integer; if it's not, the function should return false.
 * Expecting false for this test case due to an invalid bloom size.
 */
TEST(isValidArgs, InvalidBloomSize) {
    const char* argv[] = {"program_name", "8080", "invalidBloomSize", "3", "5", "7"};
    int argc = sizeof(argv) / sizeof(argv[0]);

    // Validate and parse the arguments with an invalid bloom size value
    bool result = isValidArgs(argc, const_cast<char**>(argv));

    // Assert that the function returns false due to the invalid bloom size
    EXPECT_FALSE(result);  // The function should return false for an invalid bloom size
}

/**
 * Test: Verifies how processInput handles an invalid number of arguments.
 * When the arguments are incomplete (missing values for hash mods), the function should leave the variables as is.
 * Expecting false
 */
TEST(isValidArgs, InvalidArgs) {
    const char* argv[] = {"program_name", "8080"};
    int argc = sizeof(argv) / sizeof(argv[0]);
    // Process the arguments with not enough input, expect validation to be false
    EXPECT_EQ(isValidArgs(argc, const_cast<char **>(argv)), false);

}

/**
 * Test: Verifies that processInput handles invalid non-numeric values for port and bloom size.
 * If the port and bloom size are not valid numbers, the function should not update these variables.
 * Expecting port=0, bloomSize=0, and hash mods set to valid values.
 */
TEST(ProcessInputTest, InvalidPortAndBloomSize) {
    const char* argv[] = {"program_name", "invalidPort", "invalidBloomSize", "3", "5"};
    int argc = sizeof(argv) / sizeof(argv[0]);
    // expect false
    EXPECT_EQ(isValidArgs(argc, const_cast<char**>(argv)), false);
}

