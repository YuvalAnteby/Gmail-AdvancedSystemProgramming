// Author(s): Yuval Anteby
#ifndef BLOOM_FILTER_STATUS_CODE_UTILS_H
#define BLOOM_FILTER_STATUS_CODE_UTILS_H

#include <string>
#include "utils/BloomFilterStatusEnum.h"

std::string toStatusMessage(BloomFilterStatusEnum statusCode);

#endif
