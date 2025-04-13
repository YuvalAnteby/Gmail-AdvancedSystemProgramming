// Author(s): Yuval Anteby
#include <gtest/gtest.h>
#include <fstream>
#include "data_persistence/FilePersistence.h"



const std::string testBitsPath = "tests/data/test_bits.txt";
const std::string testUrlsPath = "tests/data/test_blacklist.txt";

/**
 * Test for the case of trying to load data from the Bloom Filter file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBitArrays, LoadingNoFileExistsBloomFilter) {
    FilePersistence fp;
    // Make sure the file is deleted (if it exists)
    std::remove(testBitsPath.c_str());
     // Load from a file that doesn’t exist
     std::vector<std::vector<bool>> result = fp.loadBitArrays();
     // Expect to receive a new empty file
     EXPECT_TRUE(result.empty());
}

/**
 * Test for the case of trying to load data from the URLs file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBlacklist, LoadingNoFileExistsUrls) {
    FilePersistence fp;
    // Make sure the file is deleted (if it exists)
    std::remove(testUrlsPath.c_str());
     // Load from a file that doesn’t exist
     std::vector<std::string> result = fp.loadBlacklist();
     // Expect to receive a new empty file
     EXPECT_TRUE(result.empty());
    }

/**
 * Test for the case of trying to load empty data file of the Bloom Filter.
 * Expecting to have no errors.
 */
TEST(loadBitArrays, LoadingEmptyBloomFilter) {
    // Make sure the file exists and empty
    std::ofstream file(testBitsPath.c_str());
    file.close();
    FilePersistence fp;
    std::vector<std::vector<bool>> loadedBits;
    // Try to load
    loadedBits = fp.loadBitArrays();
    
    EXPECT_TRUE(loadedBits.empty());
}

/**
 * Test for the case of trying to load empty data file of the blacklisted URLs file.
 * Expecting to have no errors.
 */
TEST(loadBlacklist, LoadingEmptyUrls) {
    // Make sure the file exists and empty
    std::ofstream file(testUrlsPath.c_str());
    file.close();
    FilePersistence fp;
    std::vector<std::string> loadedUrls;
    // Try to load
    loadedUrls = fp.loadBlacklist();

    EXPECT_TRUE(loadedUrls.empty());
}

/**
 * Test saving the bits of Bloom Filter and then loading them - checking they are indeed the same.
 * Expecting to have the same value of text.
 */
/* TODO: currently disabled, add if using batch saving
TEST(appendBitArray, SavingBloomFilterCorrectly) {
    FilePersistence fp;
    // Create default value for the test and save it to the file
    std::vector<std::vector<bool>> bits = {{1, 0, 1, 1, 0}, {0,0,1,1,1}};
    fp.appendBitArray(bits);
    // Load the file
    std::vector<std::vector<bool>> loaded = fp.loadBitArrays();
    
    EXPECT_EQ(bits, loaded);
}*/

/**
 * Test saving the URLs and then loading them - checking they are indeed the same.
 * Expecting to have the same value of text.
 */
/* TODO: currently disabled, add if using batch saving 
TEST(appendBlacklistedUrl, SavingUrlsCorrectly) {
    FilePersistence fp;
    // Create default values for the test and save them to the file
    std::vector<std::string> urls = {
        "www.example.com",
        "www.test.com",
        "www.site.com"
    };
    fp.appendBlacklistedUrl(urls);
    // Load the file
    std::vector<std::string> loaded = fp.loadBlacklist();

    EXPECT_EQ(urls, loaded);
}*/

/**
 * Test appending new bits arrays to the bloom filter file.
 * Expecting to have all bits arrays in file.
 */
TEST(appendBitArray, AppendingBloomFilter) {
    // Delete old version of the file
    std::remove(testBitsPath.c_str());
    FilePersistence fp;
    // Create the original values for the test and save them to the file
    std::vector<std::vector<bool>> originalBits = {
        {1,0,1,1,0}, 
        {0,0,1,1,1}, 
        {1,0,0,0,0,0,0,0}
    };
    for(const std::vector<bool>& bits : originalBits) {
        fp.appendBitArray(bits);
    }
    // Load the file
    std::vector<std::vector<bool>> loaded = fp.loadBitArrays();
    // We expect the file to include all bits
    EXPECT_EQ(originalBits, loaded);
}

/**
 * Test appending new string URL to the URLs file.
 * Expecting to have all URLs in file.
 */
TEST(appendBlacklistedUrl, AppendingUrl) {
    // Delete old version of the file
    std::remove(testUrlsPath.c_str());
    FilePersistence fp;
    // Create the original values for the test and save them to the file
    std::vector<std::string> originalUrls = {
        "www.example.com",
        "www.test.com",
        "www.site.com" 
    };
    for(const std::string& url : originalUrls) {
        fp.appendBlacklistedUrl(url);
    }
    // Load the file
    std::vector<std::string> loaded = fp.loadBlacklist();
    // We expect the file to include all URLs
    EXPECT_EQ(originalUrls, loaded);
}

/**
 * Test the saving funcionality when the input of the bloom filter bits is empty.
 * Expecting an error to be thrown.
 */
TEST(appendBitArray, EmptyBitsInput) {
    // Create the empty bit array and try to save it
    std::vector<bool> bits = {};
    FilePersistence fp;
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_THROW(fp.appendBitArray(bits), std::invalid_argument);
}

/**
 * Test the saving funcionality when the input of a URL is empty.
 * Expecting an error to be thrown.
 */
TEST(appendBlacklistedUrl, EmptyUrlInput) {
    // Create the empty urls array and try to save it
    std::string url = "";
    FilePersistence fp;
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_THROW(fp.appendBlacklistedUrl(url), std::invalid_argument);
}