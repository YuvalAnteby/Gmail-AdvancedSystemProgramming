// Author(s): Yuval Anteby
#ifndef BLOOM_FILTER_COMMAND_ENUM_H
#define BLOOM_FILTER_COMMAND_ENUM_H

/**
* Enum to use for bloom filter commands, values set per the assignment instructions as needed, the rest by us.
*/
enum BloomFilterCommandEnum {
    CMD_NONE = -1, // value made up by Yuval, change if needed in future assignment
    CONFIG_INTS = 0, // value made up by Yuval, change if needed in future assignment
    POST = 1, // basically insert
    GET = 2,
    DELETE = 3 // value made up by Yuval, change if needed in future assignment
};

#endif
