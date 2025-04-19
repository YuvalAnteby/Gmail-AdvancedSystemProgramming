#include <gtest/gtest.h>
#include "bloom/BloomFilter.h"
#include "hash/HashFunctions.h"

TEST(BloomFilterTest, BasicAddAndCheck) {
    BloomFilter BloomFilter(8, getHashFunctions({1, 2}));

    BloomFilter.add("www.example.com0");
    EXPECT_TRUE(BloomFilter.mightContain("www.example.com0"));
    EXPECT_TRUE(BloomFilter.isActuallyBlacklisted("www.example.com0"));
}

TEST(BloomFilterTest, FalsePositiveCheck) {
    BloomFilter BloomFilter(8, getHashFunctions({1, 2}));
    BloomFilter.add("www.example.com0");

    std::string testUrl = "www.example.com4";
    if (BloomFilter.mightContain(testUrl)) {
        EXPECT_FALSE(BloomFilter.isActuallyBlacklisted(testUrl));  // יכול להיות false positive
    }
}

TEST(BloomFilterTest, SaveAndLoad) {
    BloomFilter BloomFilter(16, getHashFunctions({1}));
    BloomFilter.add("www.loadtest.com");

    BloomFilter.save("test_save.txt");

    BloomFilter bf2(16, getHashFunctions({1}));
    BloomFilter2.load("test_save.txt");

    EXPECT_TRUE(BloomFilter2.mightContain("www.loadtest.com"));
    EXPECT_TRUE(BloomFilter2.isActuallyBlacklisted("www.loadtest.com"));
}
