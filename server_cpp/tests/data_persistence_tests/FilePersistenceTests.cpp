// Author(s): Yuval Anteby
#include <gtest/gtest.h>
#include <fstream>
#include "data_persistence/FilePersistence.h"

#include "bloom/utils/status_code/BloomFilterStatusEnum.h"

// Default paths for the .txt files.
const std::string testBitsPath = "data/bloom_bits.txt";
const std::string testUrlsPath = "data/blacklist.txt";
const std::string testConfigIntsPath = "data/config_bloom.txt";

/**
 * Delete files upon finishing the test
 */
void deleteFiles() {
    std::remove(testBitsPath.c_str());
    std::remove(testUrlsPath.c_str());
    std::remove(testConfigIntsPath.c_str());
}

/**
 * Test for the case of trying to load data from the Bloom Filter file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBitArrays, LoadingNoFileExistsBloomFilter) {
    deleteFiles();
    IDataPersistence *fp = new FilePersistence();
    // Make sure the file is deleted (if it exists)
    std::remove(testBitsPath.c_str());
    // Load from a file that doesn’t exist
    std::vector<std::vector<bool> > result = fp->loadBitArrays();
    // Expect to receive a new empty file
    EXPECT_TRUE(result.empty());
}

/**
 * Test for the case of trying to load data from the URLs file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBlacklist, LoadingNoFileExistsUrls) {
    deleteFiles();
    IDataPersistence *fp = new FilePersistence();
    // Make sure the file is deleted (if it exists)
    std::remove(testUrlsPath.c_str());
    // Load from a file that doesn’t exist
    std::vector<std::string> result = fp->loadBlacklist();
    // Expect to receive a new empty file
    EXPECT_TRUE(result.empty());
    deleteFiles();
}

/**
 * Test for the case of trying to load empty data file of the Bloom Filter.
 * Expecting to have no errors.
 */
TEST(loadBitArrays, LoadingEmptyBloomFilter) {
    deleteFiles();
    // Make sure the file exists and empty
    std::ofstream file(testBitsPath.c_str());
    file.close();
    IDataPersistence *fp = new FilePersistence();
    std::vector<std::vector<bool> > loadedBits;
    // Try to load
    loadedBits = fp->loadBitArrays();
    EXPECT_TRUE(loadedBits.empty());
    deleteFiles();
}

/**
 * Test for the case of trying to load empty data file of the blacklisted URLs file.
 * Expecting to have no errors.
 */
TEST(loadBlacklist, LoadingEmptyUrls) {
    deleteFiles();
    // Make sure the file exists and empty
    std::ofstream file(testUrlsPath.c_str());
    file.close();
    IDataPersistence *fp = new FilePersistence();

    std::vector<std::string> loadedUrls;
    // Try to load
    loadedUrls = fp->loadBlacklist();

    EXPECT_TRUE(loadedUrls.empty());
    deleteFiles();
}

/**
 * Test appending new bits arrays to the bloom filter file.
 * Expecting to have all bits arrays in file.
 */
TEST(appendBitArray, AppendingBloomFilter) {
    deleteFiles();
    // Delete old version of the file
    std::remove(testBitsPath.c_str());
    IDataPersistence *fp = new FilePersistence();
    // Create the original values for the test and save them to the file
    std::vector<std::vector<bool> > originalBits = {
        {1, 0, 1, 1, 0},
        {0, 0, 1, 1, 1},
        {1, 0, 0, 0, 0, 0, 0, 0}
    };
    for (const std::vector<bool> &bits: originalBits) {
        fp->appendBitArray(bits);
    }
    // Load the file
    std::vector<std::vector<bool> > loaded = fp->loadBitArrays();
    // We expect the file to include all bits
    EXPECT_EQ(originalBits, loaded);
    deleteFiles();
}

/**
 * Test appending new string URL to the URLs file.
 * Expecting to have all URLs in file.
 */
TEST(appendBlacklistedUrl, AppendingUrl) {
    deleteFiles();
    // Delete old version of the file
    std::remove(testUrlsPath.c_str());
    IDataPersistence *fp = new FilePersistence();
    // Create the original values for the test and save them to the file
    std::vector<std::string> originalUrls = {
        "www.example.com",
        "www.test.com",
        "www.site.com"
    };
    for (const std::string &url: originalUrls) {
        fp->appendBlacklistedUrl(url);
    }
    // Load the file
    std::vector<std::string> loaded = fp->loadBlacklist();
    // We expect the file to include all URLs
    EXPECT_EQ(originalUrls, loaded);
    deleteFiles();
}

/**
 * Test the saving funcionality when the input of the bloom filter bits is empty.
 * Expecting an error to be thrown.
 */
TEST(appendBitArray, EmptyBitsInput) {
    deleteFiles();
    // Create the empty bit array and try to save it
    std::vector<bool> bits = {};
    IDataPersistence *fp = new FilePersistence();
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_FALSE(fp->appendBitArray(bits));
    deleteFiles();
}

/**
 * Test the saving funcionality when the input of a URL is empty.
 * Expecting an error to be thrown.
 */
TEST(appendBlacklistedUrl, EmptyUrlInput) {
    deleteFiles();
    // Create the empty urls array and try to save it
    std::string url = "";
    IDataPersistence *fp = new FilePersistence();
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_FALSE(fp->appendBlacklistedUrl(url));
    deleteFiles();
}

/**
 * Test for the case of trying to load data from the Bloom Filter config file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadConfigInts, LoadingNoFileExistsConfigBloomFilter) {
    deleteFiles();
    IDataPersistence *fp = new FilePersistence();
    // Make sure the file is deleted (if it exists)
    std::remove(testConfigIntsPath.c_str());
    // Load from a file that doesn’t exist
    std::vector<std::vector<bool> > result = fp->loadBitArrays();
    // Expect to receive a new empty file
    EXPECT_TRUE(result.empty());
    deleteFiles();
}

/**
 * Test for the case of trying to load empty data file of the config ints.
 * Expecting to have no errors.
 */
TEST(loadConfigInts, LoadingEmptyConfigFile) {
    deleteFiles();
    // Make sure the file exists and empty
    std::ofstream file(testConfigIntsPath.c_str());
    file.close();
    IDataPersistence *fp = new FilePersistence();
    std::vector<int> loadedInts;
    // Try to load
    loadedInts = fp->loadConfigInts();

    EXPECT_TRUE(loadedInts.empty());
    deleteFiles();
}

/**
 * Test appending new ints arrays to the bloom filter config file.
 * Expecting to have the entire ints array in file (exactly as before insertion).
 */
TEST(appendConfigInts, AppendingConfigInts) {
    deleteFiles();
    // Delete old version of the file
    std::remove(testConfigIntsPath.c_str());
    IDataPersistence *fp = new FilePersistence();
    // Create the original values for the test and save them to the file
    std::vector<int> originalInts = {8, 1, 2, 4, 5};
    fp->appendConfigInts(originalInts);
    // Load the file
    std::vector<int> loaded = {};
    loaded.push_back(fp->getBitSizeConfig());
    std::vector<int> ints = fp->loadConfigInts();
    loaded.insert(loaded.end(), ints.begin(), ints.end());
    // We expect the file to include all integers
    EXPECT_EQ(originalInts, loaded);
    deleteFiles();
}

/**
 * Test the saving funcionality when the input of the bloom filter config integers is empty.
 * Expecting an error to be thrown.
 */
TEST(appendConfigInts, EmptyConfigIntsInput) {
    deleteFiles();
    // Create the empty bit array and try to save it
    std::vector<int> ints = {};
    IDataPersistence *fp = new FilePersistence();
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_FALSE(fp->appendConfigInts(ints));
    deleteFiles();
}

/**
 * Test the deletion functionality when the file is empty.
 * Expecting to receive enum "NOT_FOUND"
 */
TEST(deleteUrl, deleteFromEmptyFile) {
    deleteFiles();
    const std::string url = "www.example.com";
    IDataPersistence *fp = new FilePersistence();
    fp->loadBlacklist();
    EXPECT_EQ(fp->deleteUrl(url), NOT_FOUND);
    deleteFiles();
}

/**
 * Test the deletion functionality when the given URL is invalid.
 * Expecting to receive enum "BAD_REQUEST"
 */
TEST(deleteUrl, deleteInvalidURL) {
    deleteFiles();
    const std::string url1 = "";
    const std::string url2 = "example";
    IDataPersistence *fp = new FilePersistence();
    fp->loadBlacklist();
    EXPECT_EQ(fp->deleteUrl(url1), BAD_REQUEST);
    EXPECT_EQ(fp->deleteUrl(url2), BAD_REQUEST);
    deleteFiles();
}

/**
 * Test deletion functionality with a valid URL from a file that contains it.
 * Expecting to receive enum "NO_CONTENT" and have only the given URL deleted from file.
 */
TEST(deleteUrl, deleteValidURL) {
    deleteFiles();
    IDataPersistence *fp = new FilePersistence();
    fp->loadBlacklist();
    const std::vector<std::string> urls = {
        "www.example.com0",
        "www.example.com1",
        "www.example.com2",
        "www.example.com3",
        "www.example.com4"
    };
    for (const std::string &url: urls) {
        fp->appendBlacklistedUrl(url);
    }
    const std::string url = "www.example.com2";
    BloomFilterStatusEnum resultEnum = fp->deleteUrl(url);
    EXPECT_EQ(resultEnum, NO_CONTENT);
    const std::vector<std::string> expectedUrls = {
        "www.example.com0",
        "www.example.com1",
        "www.example.com3",
        "www.example.com4"
    };
    EXPECT_EQ(fp->loadBlacklist(), expectedUrls);
    deleteFiles();
}

/**
 * Test deletion functionality with a valid URL that the file doesn't have.
 * Expecting to receive enum "NOT_FOUND" and have the file with the same values
 */
TEST(deleteUrl, deleteURLNotInFile) {
    deleteFiles();
    IDataPersistence *fp = new FilePersistence();
    fp->loadBlacklist();
    const std::vector<std::string> urls = {
        "www.example.com0",
        "www.example.com1",
        "www.example.com2",
        "www.example.com3",
        "www.example.com4"
    };
    for (const std::string &url: urls) {
        fp->appendBlacklistedUrl(url);
    }
    const std::string url = "www.example.com";
    EXPECT_EQ(fp->deleteUrl(url), NOT_FOUND);
    EXPECT_EQ(fp->loadBlacklist(), urls);
    deleteFiles();
}
