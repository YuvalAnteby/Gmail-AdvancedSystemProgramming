// InsertUrlCommandTest.cpp
#include <gtest/gtest.h>
#include "bloom/commands/InsertUrlCommand.h"
#include "bloom/hash/Hasher.h"
#include <vector>
#include <string>
#include "strategy_io/console/ConsoleOutputWriter.h"

// ==========================================
// Mock class for IDataPersistence
// Simulates saving/loading without touching real files
// ==========================================
class MockPersistence : public IDataPersistence {
public:
    int bitSize;
    std::vector<int> configInts;
    std::vector<std::vector<bool>> bitArrays;
    std::vector<std::string> blacklist;
    
    // Flags to track if methods were called
    bool bitArrayAppended = false;
    bool configIntsAppended = false;
    bool urlAppended = false;

    // Constructor
    MockPersistence(int bitSize, const std::vector<int>& configInts)
        : bitSize(bitSize), configInts(configInts) {}

    // Implement the required interface methods
    int getBitSizeConfig() override { return bitSize; }
    std::vector<int> loadConfigInts() override { return configInts; }
    std::vector<std::vector<bool>> loadBitArrays() override { return bitArrays; }
    std::vector<std::string> loadBlacklist() override { return blacklist; }

    bool appendBlacklistedUrl(const std::string& url) override {
        urlAppended = true;
        blacklist.push_back(url);
        return true;
    }

    bool appendConfigInts(const std::vector<int>& ints) override {
        configIntsAppended = true;
        configInts = ints;
        return true;
    }

    bool appendBitArray(const std::vector<bool>& bits) override {
        bitArrayAppended = true;
        bitArrays.push_back(bits);
        return true;
    }
};

// ==========================================
// Helper function: builds the expected bit array
// for a given URL and config parameters
// ==========================================
std::vector<bool> createExpectedBits(const std::string& url, const std::vector<int>& config, int size) {
    Hasher hasher(url);
    std::vector<bool> bits(size, false);
    for (int c : config) {
        bits[hasher.hashN(c) % size] = true;
    }
    return bits;
}

// ==========================================
// TEST CASES
// ==========================================

//: Inserting a normal URL successfully
TEST(InsertUrlCommandTest, InsertNewUrlSuccessfully) {
    std::string url = "insertme.com";
    int size = 10;
    std::vector<int> config = {1, 2};
    IOutputWriter *outputWriter = new ConsoleOutputWriter();
    MockPersistence mock(size, config);
    InsertUrlCommand cmd(url, mock, config, size, *outputWriter);
    cmd.execute();

    // Expectations
    EXPECT_TRUE(mock.urlAppended);          // URL should be added
    EXPECT_TRUE(mock.bitArrayAppended);     // Bit array should be added
    EXPECT_FALSE(mock.configIntsAppended);  // Config should NOT be appended again

    ASSERT_EQ(mock.blacklist.size(), 1);
    EXPECT_EQ(mock.blacklist[0], url);

    ASSERT_EQ(mock.bitArrays.size(), 1);
    std::vector<bool> expectedBits = createExpectedBits(url, config, size);
    EXPECT_EQ(mock.bitArrays[0], expectedBits);
}

//  Inserting an empty URL string
TEST(InsertUrlCommandTest, InsertEmptyUrlShouldStillWork) {
    std::string url = "";
    int size = 5;
    std::vector<int> config = {1};
    IOutputWriter *outputWriter = new ConsoleOutputWriter();
    MockPersistence mock(size, config);
    InsertUrlCommand cmd(url, mock, config, size, *outputWriter);
    cmd.execute();

    // Expectations
    EXPECT_TRUE(mock.urlAppended);          // Even empty URL should be added
    EXPECT_TRUE(mock.bitArrayAppended);

    EXPECT_EQ(mock.blacklist[0], url);       // The inserted URL should be the empty string
}

// Inserting a URL when the Bloom filter is very large
TEST(InsertUrlCommandTest, InsertUrlWithLargeBitSize) {
    std::string url = "bigsize.com";
    int size = 50000;
    std::vector<int> config = {5, 10, 20};
    IOutputWriter *outputWriter = new ConsoleOutputWriter();
    MockPersistence mock(size, config);
    InsertUrlCommand cmd(url, mock, config, size, *outputWriter);
    cmd.execute();

    // Expectations
    EXPECT_TRUE(mock.urlAppended);
    EXPECT_TRUE(mock.bitArrayAppended);

    std::vector<bool> expectedBits = createExpectedBits(url, config, size);
    EXPECT_EQ(mock.bitArrays[0], expectedBits);
}

//  Inserting a URL when config is empty (no hash functions)
// Should still insert, but no bits should be set
TEST(InsertUrlCommandTest, InsertUrlWithEmptyConfig) {
    std::string url = "noconfig.com";
    int size = 10;
    std::vector<int> config = {}; // No hash functions
    IOutputWriter *outputWriter = new ConsoleOutputWriter();
    MockPersistence mock(size, config);
    InsertUrlCommand cmd(url, mock, config, size, *outputWriter);
    cmd.execute();

    // Expectations
    EXPECT_TRUE(mock.urlAppended);
    EXPECT_TRUE(mock.bitArrayAppended);

    // All bits should stay false (empty configuration)
    std::vector<bool> expected(size, false);
    EXPECT_EQ(mock.bitArrays[0], expected);
}
