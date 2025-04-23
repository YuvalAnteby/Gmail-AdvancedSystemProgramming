// Author(s): Yuval Anteby
#include <gtest/gtest.h>
#include <fstream>
#include "data_persistence/FilePersistence.h"

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
TEST(loadBitArrays, LoadingNoFileExistsBloomFilter)
{
    IDataPersistence *fp = new FilePersistence();
    // Make sure the file is deleted (if it exists)
    std::remove(testBitsPath.c_str());
    // Load from a file that doesn’t exist
    std::vector<std::vector<bool>> result = fp->loadBitArrays();
    // Expect to receive a new empty file
    EXPECT_TRUE(result.empty());
}

/**
 * Test for the case of trying to load data from the URLs file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBlacklist, LoadingNoFileExistsUrls)
{
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
TEST(loadBitArrays, LoadingEmptyBloomFilter)
{
    // Make sure the file exists and empty
    std::ofstream file(testBitsPath.c_str());
    file.close();
    IDataPersistence *fp = new FilePersistence();
    std::vector<std::vector<bool>> loadedBits;
    // Try to load
    loadedBits = fp->loadBitArrays();
    EXPECT_TRUE(loadedBits.empty());
    deleteFiles();
}

/**
 * Test for the case of trying to load empty data file of the blacklisted URLs file.
 * Expecting to have no errors.
 */
TEST(loadBlacklist, LoadingEmptyUrls)
{
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
TEST(appendBitArray, AppendingBloomFilter)
{
    // Delete old version of the file
    std::remove(testBitsPath.c_str());
    IDataPersistence *fp = new FilePersistence();
    // Create the original values for the test and save them to the file
    std::vector<std::vector<bool>> originalBits = {
        {1, 0, 1, 1, 0},
        {0, 0, 1, 1, 1},
        {1, 0, 0, 0, 0, 0, 0, 0}};
    for (const std::vector<bool> &bits : originalBits)
    {
        fp->appendBitArray(bits);
    }
    // Load the file
    std::vector<std::vector<bool>> loaded = fp->loadBitArrays();
    // We expect the file to include all bits
    EXPECT_EQ(originalBits, loaded);
    deleteFiles();
}

/**
 * Test appending new string URL to the URLs file.
 * Expecting to have all URLs in file.
 */
TEST(appendBlacklistedUrl, AppendingUrl)
{
    // Delete old version of the file
    std::remove(testUrlsPath.c_str());
    IDataPersistence *fp = new FilePersistence();
    // Create the original values for the test and save them to the file
    std::vector<std::string> originalUrls = {
        "www.example.com",
        "www.test.com",
        "www.site.com"};
    for (const std::string &url : originalUrls)
    {
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
TEST(appendBitArray, EmptyBitsInput)
{
    // Create the empty bit array and try to save it
    std::vector<bool> bits = {};
    IDataPersistence *fp = new FilePersistence();
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_THROW(fp->appendBitArray(bits), std::invalid_argument);
    deleteFiles();
}

/**
 * Test the saving funcionality when the input of a URL is empty.
 * Expecting an error to be thrown.
 */
TEST(appendBlacklistedUrl, EmptyUrlInput)
{
    // Create the empty urls array and try to save it
    std::string url = "";
    IDataPersistence *fp = new FilePersistence();
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_THROW(fp->appendBlacklistedUrl(url), std::invalid_argument);
    deleteFiles();
}

/**
 * Test for the case of trying to load data from the Bloom Filter config file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadConfigInts, LoadingNoFileExistsConfigBloomFilter)
{
    IDataPersistence *fp = new FilePersistence();
    // Make sure the file is deleted (if it exists)
    std::remove(testConfigIntsPath.c_str());
    // Load from a file that doesn’t exist
    std::vector<std::vector<bool>> result = fp->loadBitArrays();
    // Expect to receive a new empty file
    EXPECT_TRUE(result.empty());
    deleteFiles();
}

/**
 * Test for the case of trying to load empty data file of the config ints.
 * Expecting to have no errors.
 */
TEST(loadConfigInts, LoadingEmptyConfigFile)
{
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
TEST(appendConfigInts, AppendingConfigInts)
{
    // Delete old version of the file
    std::remove(testConfigIntsPath.c_str());
    IDataPersistence *fp = new FilePersistence();
    // Create the original values for the test and save them to the file
    std::vector<int> originalInts = {8, 1, 2, 4, 5};
    fp->appendConfigInts(originalInts);
    // Load the file
    std::vector<int> loaded = fp->loadConfigInts();
    // We expect the file to include all integers
    EXPECT_EQ(originalInts, loaded);
    deleteFiles();
}

/**
 * Test the saving funcionality when the input of the bloom filter config integers is empty.
 * Expecting an error to be thrown.
 */
TEST(appendConfigInts, EmptyConfigIntsInput)
{
    // Create the empty bit array and try to save it
    std::vector<int> ints = {};
    IDataPersistence *fp = new FilePersistence();
    // Expect invalid argument error to be thrown when trying to save
    EXPECT_THROW(fp->appendConfigInts(ints), std::invalid_argument);
    deleteFiles();
}