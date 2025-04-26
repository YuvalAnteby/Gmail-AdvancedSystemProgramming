// Unit tests for CheckUrlCommand-related logic
#include <gtest/gtest.h>
#include "bloom/commands/CheckUrlCommand.h"
#include "bloom/hash/Hasher.h"
#include <memory>
#include <sstream>

// Mock class for IDataPersistence
class MockPersistence : public IDataPersistence {
public:
    int bitSize;
    std::vector<int> configInts;
    std::vector<std::vector<bool>> bitArrays;
    std::vector<std::string> blacklist;

    // Constructor
    MockPersistence(int bitSize, std::vector<int> configInts, std::vector<std::vector<bool>> bitArrays, std::vector<std::string> blacklist)
        : bitSize(bitSize), configInts(configInts), bitArrays(bitArrays), blacklist(blacklist) {}

    // Mocked functions
    int getBitSizeConfig() override {
        return bitSize;
    }

    std::vector<int> loadConfigInts() override {
        return configInts;
    }

    std::vector<std::vector<bool>> loadBitArrays() override {
        return bitArrays;
    }

    std::vector<std::string> loadBlacklist() override {
        return blacklist;
    }

    void appendBlacklistedUrl(const std::string&) override {}
    void appendConfigInts(const std::vector<int>&) override {}
    void appendBitArray(const std::vector<bool>&) override {}
};

// -----------------------------
// Test cases begin
// -----------------------------

// ✅ Test: URL should NOT be found in an empty Bloom filter
TEST(CheckUrlCommandTest, UrlNotInEmptyFilter) {
    std::string url = "http://example.com";
    MockPersistence mock(10, {1}, {}, {}); // Empty filter
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// ✅ Test: URL IS present in Bloom filter and blacklist
TEST(CheckUrlCommandTest, UrlInFilterAndBlacklist) {
    std::string url = "test";
    std::vector<bool> bits(10, false);
    Hasher h(url);
    bits[h.hashN(1) % 10] = true;

    MockPersistence mock(10, {1}, {bits}, {url}); // In filter AND blacklist
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_TRUE(cmd.wasFound());
}

// ✅ Test: URL *seems* to be in filter but NOT in blacklist (false positive)
TEST(CheckUrlCommandTest, UrlFalsePositive) {
    std::string url = "test";
    std::vector<bool> bits(10, false);
    Hasher h(url);
    bits[h.hashN(1) % 10] = true;

    MockPersistence mock(10, {1}, {bits}, {}); // In filter but NOT in blacklist
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// ✅ Test: Simulate a HASH COLLISION (different URLs map same bits)
TEST(CheckUrlCommandTest, HashCollision) {
    std::string url1 = "collision1";
    std::string url2 = "collision2";
    Hasher h1(url1);
    Hasher h2(url2);

    std::vector<bool> bits(10, false);
    bits[h1.hashN(1) % 10] = true;
    bits[h2.hashN(1) % 10] = true;

    MockPersistence mock(10, {1}, {bits}, {url2}); // Only url2 blacklisted
    CheckUrlCommand cmd(url1, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// ✅ Test: Handle multiple hash functions correctly
TEST(CheckUrlCommandTest, MultiHashFunctionCheck) {
    std::string url = "multitest";
    std::vector<int> config = {2, 3, 5};
    std::vector<bool> bits(50, false);
    Hasher h(url);

    for (int c : config)
        bits[h.hashN(c) % 50] = true;

    MockPersistence mock(50, config, {bits}, {url});
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_TRUE(cmd.wasFound());
}

// ✅ Test: Edge case - empty URL string
TEST(CheckUrlCommandTest, EmptyUrl) {
    std::string url = "";
    MockPersistence mock(10, {1}, {}, {});
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// ✅ Test: Very large Bloom filter array
TEST(CheckUrlCommandTest, LargeBitArray) {
    std::string url = "largebit";
    int size = 100000;
    std::vector<bool> bits(size, false);
    Hasher h(url);
    bits[h.hashN(1) % size] = true;

    MockPersistence mock(size, {1}, {bits}, {url});
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_TRUE(cmd.wasFound());
}
