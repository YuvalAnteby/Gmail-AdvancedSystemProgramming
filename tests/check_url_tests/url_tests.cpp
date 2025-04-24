#include <gtest/gtest.h>
#include <string>
#include <sstream>
#include <up_utils/utils.h>
/**
 * Test: Valid input with exactly two numbers.
 * Expected: Should succeed, set hash1 to second number, and hash2 to 0.
 */
TEST(ProcessLineTest, ValidTwoNumbers) {
    int h1 = 0, h2 = 0;
    EXPECT_TRUE(processLine("100 200"));
    EXPECT_EQ(h1, 200);
    EXPECT_EQ(h2, 0);
}

/**
 * Test: Valid input with exactly three numbers.
 * Expected: Should succeed, set hash1 to second, hash2 to third number.
 */
TEST(ProcessLineTest, ValidThreeNumbers) {
    int h1 = 0, h2 = 0;
    EXPECT_TRUE(processLine("10 20 30"));
    EXPECT_EQ(h1, 20);
    EXPECT_EQ(h2, 30);
}

/**
 * Test: Input line contains letters.
 * Expected: Should fail and print "false".
 */
TEST(ProcessLineTest, InvalidWithLetters) {
    int h1 = 0, h2 = 0;
    testing::internal::CaptureStdout();
    EXPECT_FALSE(processLine("abc 123 456"));
    std::string output = testing::internal::GetCapturedStdout();
    EXPECT_EQ(output, "false\n");
}

/**
 * Test: Input contains symbols or non-digit characters.
 * Expected: Should fail and print "false".
 */
TEST(ProcessLineTest, InvalidWithSpecialCharacters) {
    int h1 = 0, h2 = 0;
    testing::internal::CaptureStdout();
    EXPECT_FALSE(processLine("123 !@# 456"));
    std::string output = testing::internal::GetCapturedStdout();
    EXPECT_EQ(output, "false\n");
}
/**
 * Test: Valid HTTP URL format.
 * Expected: Should return true.
 */
TEST(IsValidURLTest, ValidHttpURL) {
    EXPECT_TRUE(isValidURL("http://example.com/"));
}

/**
 * Test: Valid HTTPS URL with path.
 * Expected: Should return true.
 */
TEST(IsValidURLTest, ValidHttpsURL) {
    EXPECT_TRUE(isValidURL("https://www.test-site.org/path/"));
}

/**
 * Test: URL missing protocol (http/https).
 * Expected: Should return false.
 */
TEST(IsValidURLTest, InvalidMissingProtocol) {
    EXPECT_FALSE(isValidURL("www.example.com"));
}

/**
 * Test: URL with invalid characters.
 * Expected: Should return false.
 */
TEST(IsValidURLTest, InvalidURLCharacters) {
    EXPECT_FALSE(isValidURL("https://examp$le.com"));
}
/**
 * Test: Input contains only digits.
 * Expected: Should return true.
 */
TEST(ContainsOnlyDigitsAndWhitespaceTest, OnlyDigits) {
    EXPECT_TRUE(containsOnlyDigitsAndWhitespace("123456"));
}

/**
 * Test: Input contains digits and spaces.
 * Expected: Should return true.
 */
TEST(ContainsOnlyDigitsAndWhitespaceTest, DigitsWithSpaces) {
    EXPECT_TRUE(containsOnlyDigitsAndWhitespace("12 34 56"));
}

/**
 * Test: Input contains letters.
 * Expected: Should return false.
 */
TEST(ContainsOnlyDigitsAndWhitespaceTest, ContainsLetter) {
    EXPECT_FALSE(containsOnlyDigitsAndWhitespace("123a56"));
}

/**
 * Test: Input contains special character.
 * Expected: Should return false.
 */
TEST(ContainsOnlyDigitsAndWhitespaceTest, ContainsSymbol) {
    EXPECT_FALSE(containsOnlyDigitsAndWhitespace("123@456"));
}

/**
 * Test: Fully valid line with digits and a valid structure.
 * Expected: Should return true.
 */
TEST(IsValidLineTest, ValidLine) {
    EXPECT_TRUE(isValidLine("1 1 2"));
}

/**
 * Test: Line contains alphabetic characters.
 * Expected: Should return false.
 */
TEST(IsValidLineTest, InvalidLineWithLetters) {
    EXPECT_FALSE(isValidLine("1 a 2"));
}

/**
 * Test: Command structure includes invalid values.
 * Expected: Should return false.
 */
TEST(IsValidLineTest, InvalidStructure) {
    EXPECT_FALSE(isValidLine("1 3 4"));
}
/**
 * Test: Valid URL with command '1'.
 * Expected: URL is valid, no "false" output should be printed.
 */
TEST(HandleUserChoiceTest, ValidURLCommand1) {
    int hash1 = 10, hash2 = 20;
    std::string input = "1 https://example.com/";
    testing::internal::CaptureStdout();
    handleUserChoice(input, hash1, hash2);
    std::string output = testing::internal::GetCapturedStdout();
    EXPECT_EQ(output, "");
}

/**
 * Test: Valid URL with command '2'.
 * Expected: URL is valid, no "false" output should be printed.
 */
TEST(HandleUserChoiceTest, ValidURLCommand2) {
    int hash1 = 5, hash2 = 15;
    std::string input = "2 https://google.com/";
    testing::internal::CaptureStdout();
    handleUserChoice(input, hash1, hash2);
    std::string output = testing::internal::GetCapturedStdout();
    EXPECT_EQ(output, "");
}

/**
 * Test: Invalid URL (missing protocol) with command '1'.
 * Expected: Should print "false" because URL is not valid.
 */
TEST(HandleUserChoiceTest, InvalidURLMissingProtocol) {
    int hash1 = 1, hash2 = 1;
    std::string input = "1 www.example.com";
    testing::internal::CaptureStdout();
    handleUserChoice(input, hash1, hash2);
    std::string output = testing::internal::GetCapturedStdout();
    EXPECT_EQ(output, "false\n");
}

/**
 * Test: Invalid URL with special characters.
 * Expected: Should print "false".
 */
TEST(HandleUserChoiceTest, InvalidURLWithSymbols) {
    int hash1 = 1, hash2 = 1;
    std::string input = "2 https://bad!url.com/";
    testing::internal::CaptureStdout();
    handleUserChoice(input, hash1, hash2);
    std::string output = testing::internal::GetCapturedStdout();
    EXPECT_EQ(output, "false\n");
}

/**
 * Test: Empty URL after command character.
 * Expected: Should print "false".
 */
TEST(HandleUserChoiceTest, EmptyURLAfterCommand) {
    int hash1 = 1, hash2 = 1;
    std::string input = "1 ";
    testing::internal::CaptureStdout();
    handleUserChoice(input, hash1, hash2);
    std::string output = testing::internal::GetCapturedStdout();
    EXPECT_EQ(output, "false\n");

}
