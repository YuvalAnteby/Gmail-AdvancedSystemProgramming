// Author(s): Yuval Anteby
#include <gtest/gtest.h>
#include <fstream>
#include <iostream>
#include "data_persistence/FilePersistence.h"



const std::string testBitsPath = "tests/data/test_bits.txt";
const std::string testUrlsPath = "tests/data/test_blacklist.txt";

/**
 * Test for the case of trying to load data from the Bloom Filter file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBitArray, LoadingNoFileExistsBloomFilter) {

}

/**
 * Test for the case of trying to load empty data file of the Bloom Filter.
 * Expecting to have no errors.
 */
TEST(loadBitArray, LoadingEmptyBloomFilter) {
    // Make sure the file exists and empty
    std::ofstream file(testBitsPath.c_str());
    file.close();
    FilePersistence fp;
    std::vector<std::vector<bool>> loadedBits;
    // Try to load
    loadedBits = fp.loadBitArray();
    
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
 * Test for the case of trying to load data from the URLs file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBlacklist, LoadingNoFileExistsUrls) {
//TODO
}

/**
 * Test saving the bits of Bloom Filter and then loading them - cheking they are indeed the same.
 * Expecting to have the same value of text.
 */
TEST(saveBitArray, SavingBloomFilterCorrectly) {
    FilePersistence fp;
    // Create default value for the test and save it to the file
    std::vector<std::vector<bool>> bits = {{1, 0, 1, 1, 0}, {0,0,1,1,1}};
    fp.saveBitArray(bits);
    // Load the file
    std::vector<std::vector<bool>> loaded = fp.loadBitArray();
    
    EXPECT_EQ(bits, loaded);
}

/**
 * Test saving the URLs and then loading them - cheking they are indeed the same.
 * Expecting to have the same value of text.
 */
TEST(saveBlacklist, SavingUrlsCorrectly) {
    FilePersistence fp;
    // Create default values for the test and save them to the file
    std::vector<std::string> urls = {
        "www.example.com",
        "www.test.com",
        "www.site.com"
    };
    fp.saveBlacklist(urls);
    // Load the file
    std::vector<std::string> loaded = fp.loadBlacklist();

    EXPECT_EQ(urls, loaded);
}

/**
 * Test overwriting the bloom filter file.
 * Expecting to have the new text in the file.
 */
TEST(saveBitArray, OverwriteExistingBloomFilterFile) {
//TODO
}

/**
 * Test overwriting the URLs file.
 * Expecting to have the new text in the file.
 */
TEST(saveBlacklist, OverwriteExistingUrlsFile) {
//TODO
}

/**
 * Test the saving funcionality when the input of the bloom filter bits is empty.
 * Expecting an error to be thrown.
 */
TEST(saveBitArray, EmptyBitsInput) {
//TODO
}

/**
 * Test the saving funcionality when the input of a URL is empty.
 * Expecting an error to be thrown.
 */
TEST(saveBlacklist, EmptyUrlInput) {
//TODO
}