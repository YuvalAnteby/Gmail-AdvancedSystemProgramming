// Unit tests for CheckUrlCommand-related logic
#include <gtest/gtest.h>
#include "bloom/CheckUrlCommand.h"
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

    MockPersistence(int bitSize, std::vector<int> configInts, std::vector<std::vector<bool>> bitArrays, std::vector<std::string> blacklist)
        : bitSize(bitSize), configInts(configInts), bitArrays(bitArrays), blacklist(blacklist) {}

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

// Test if URL is not present in an empty Bloom filter
TEST(CheckUrlCommandTest, UrlNotInEmptyFilter) {
    std::string url = "http://example.com";
    MockPersistence mock(10, {1}, {}, {});
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// Test with a simple URL in the Bloom filter and in the blacklist
TEST(CheckUrlCommandTest, UrlInFilterAndBlacklist) {
    std::string url = "test";
    std::vector<bool> bits(10, false);
    Hasher h(url);
    bits[h.hashN(1) % 10] = true;
    MockPersistence mock(10, {1}, {bits}, {url});
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_TRUE(cmd.wasFound());
}

// Test with a false positive: URL might be in filter but not in blacklist
TEST(CheckUrlCommandTest, UrlFalsePositive) {
    std::string url = "test";
    std::vector<bool> bits(10, false);
    Hasher h(url);
    bits[h.hashN(1) % 10] = true;
    MockPersistence mock(10, {1}, {bits}, {}); // Not in blacklist
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// Test with a hash collision: another URL causes same bits
TEST(CheckUrlCommandTest, HashCollision) {
    std::string url1 = "collision1";
    std::string url2 = "collision2";
    Hasher h1(url1);
    Hasher h2(url2);
    std::vector<bool> bits(10, false);
    bits[h1.hashN(1) % 10] = true;
    bits[h2.hashN(1) % 10] = true;

    MockPersistence mock(10, {1}, {bits}, {url2});
    CheckUrlCommand cmd(url1, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// Test with multiple config ints (multiple hashes per URL)
TEST(CheckUrlCommandTest, MultiHashFunctionCheck) {
    std::string url = "multitest";
    std::vector<int> config = {2, 3, 5};
    std::vector<bool> bits(50, false);
    Hasher h(url);
    for (int c : config) bits[h.hashN(c) % 50] = true;

    MockPersistence mock(50, config, {bits}, {url});
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_TRUE(cmd.wasFound());
}

// Edge case: URL is empty
TEST(CheckUrlCommandTest, EmptyUrl) {
    std::string url = "";
    MockPersistence mock(10, {1}, {}, {});
    CheckUrlCommand cmd(url, mock);
    cmd.execute();
    EXPECT_FALSE(cmd.wasFound());
}

// Edge case: extremely large bit array size
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
