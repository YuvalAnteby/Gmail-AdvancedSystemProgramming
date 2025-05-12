#include <gtest/gtest.h>
#include "bloom/hash/Hasher.h"

// Test that hashN(1) is consistent for the same base string
TEST(HasherTest, HashN1Consistency) {
    Hasher hasher("test_string");

    size_t hash1 = hasher.hashN(1);
    size_t hash2 = hasher.hashN(1);

    EXPECT_EQ(hash1, hash2);  // Should always match
}

// Test that increasing n changes the output
TEST(HasherTest, IncreasingNChangesOutput) {
    Hasher hasher("example");

    size_t h1 = hasher.hashN(1);
    size_t h2 = hasher.hashN(2);
    size_t h3 = hasher.hashN(3);

    EXPECT_NE(h1, h2);
    EXPECT_NE(h2, h3);
    EXPECT_NE(h1, h3);
}

// Test that same base and n across two instances gives same result
TEST(HasherTest, DeterminismAcrossInstances) {
    Hasher h1("constant");
    Hasher h2("constant");

    EXPECT_EQ(h1.hashN(5), h2.hashN(5));
}

// Test that different base strings result in different hashes
TEST(HasherTest, DifferentBaseStrings) {
    Hasher h1("apple");
    Hasher h2("banana");

    EXPECT_NE(h1.hashN(4), h2.hashN(4));
}

// Edge case: hashN(0) should return the first hash unchanged (or throw/error if not allowed)
TEST(HasherTest, ZeroRepetitionsReturnsFirstHash) {
    Hasher hasher("zero_case");

    // Optional: allow n == 0 and just return base hash once
    EXPECT_EQ(hasher.hashN(1), hasher.hashN(0));  // If implemented this way
}
