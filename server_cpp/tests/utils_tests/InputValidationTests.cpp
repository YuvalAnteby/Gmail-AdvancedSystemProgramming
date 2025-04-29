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
 * Test: try valid commands structures
 * Expected: getting true to every input
 */
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

/**
 * Test: try valid commands structures
 * Expected: getting true to every input
 */
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