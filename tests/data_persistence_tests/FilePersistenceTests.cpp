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

}

/**
 * Test for the case of trying to load empty data file of the blacklisted URLs file.
 * Expecting to have no errors.
 */
TEST(loadBlacklist, LoadingEmptyUrls) {

}

/**
 * Test for the case of trying to load data from the URLs file but it doesn't exist.
 * Expecting to have new file created and no errors.
 */
TEST(loadBlacklist, LoadingNoFileExistsUrls) {

}

/**
 * Test saving the bits of Bloom Filter and then loading them - cheking they are indeed the same.
 * Expecting to have the same value of text.
 */
TEST(saveBitArray, SavingBloomFilterCorrectly) {

}

/**
 * Test saving the URLs and then loading them - cheking they are indeed the same.
 * Expecting to have the same value of text.
 */
TEST(saveBlacklist, SavingUrlsCorrectly) {

}

/**
 * Test overwriting the bloom filter file.
 * Expecting to have the new text in the file.
 */
TEST(saveBitArray, OverwriteExistingBloomFilterFile) {

}

/**
 * Test overwriting the URLs file.
 * Expecting to have the new text in the file.
 */
TEST(saveBlacklist, OverwriteExistingUrlsFile) {

}

/**
 * Test the saving funcionality when the input of the bloom filter bits is empty.
 * Expecting an error to be thrown.
 */
TEST(saveBitArray, EmptyBitsInput) {

}

/**
 * Test the saving funcionality when the input of a URL is empty.
 * Expecting an error to be thrown.
 */
TEST(saveBlacklist, EmptyUrlInput) {

}