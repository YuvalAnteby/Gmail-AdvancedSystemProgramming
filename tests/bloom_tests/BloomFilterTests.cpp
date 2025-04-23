#include <gtest/gtest.h>
#include "bloom/BloomFilter.h"
#include "hash/HashFunctions.h"
#include "data_persistence\FilePersistence.h"

// This test checks basic behavior: adding a URL and verifying it exists in the Bloom Filter
TEST(BloomFilterTest, BasicAddAndCheck) {
    FilePersistence fp;
    fp.appendBlacklistedUrl("www.example.com0")
    BloomFilter bf(8, getHashFunctions({1, 2}));
    EXPECT_TRUE(bf.mightContain("www.example.com0"));          // Might be there according to Bloom Filter
    EXPECT_TRUE(bf.isActuallyBlacklisted("www.example.com0")); // Definitely blacklisted (stored in the set)
}

// This test checks for a potential false positive — URL might be detected by Bloom Filter but not truly blacklisted
TEST(BloomFilterTest, FalsePositiveCheck) {
    BloomFilter bf(8, getHashFunctions({1, 2}));
    bf.add("www.example.com0");

    std::string testUrl = "www.example.com4";
    if (bf.mightContain(testUrl)) {
        EXPECT_FALSE(bf.isActuallyBlacklisted(testUrl));  // Should not be in the actual blacklist
    }
}

// This test ensures the filter can be saved to a file and correctly loaded back
TEST(BloomFilterTest, SaveAndLoad) {
    BloomFilter bf(16, getHashFunctions({1}));
    bf.add("www.loadtest.com");

    bf.save("test_save.txt");  // Save state to file

    BloomFilter bf2(16, getHashFunctions({1}));
    bf2.load("test_save.txt"); // Load into new BloomFilter

    EXPECT_TRUE(bf2.mightContain("www.loadtest.com"));          // Bloom Filter still detects it
    EXPECT_TRUE(bf2.isActuallyBlacklisted("www.loadtest.com")); // Confirm it's in actual blacklist
}

// This test checks behavior when nothing has been added yet
TEST(BloomFilterTest, EmptyFilter) {
    BloomFilter bf(8, getHashFunctions({1, 2}));
    EXPECT_FALSE(bf.mightContain("www.notadded.com"));
    EXPECT_FALSE(bf.isItActuallyBlacklisted("www.notadded.com"));
}
