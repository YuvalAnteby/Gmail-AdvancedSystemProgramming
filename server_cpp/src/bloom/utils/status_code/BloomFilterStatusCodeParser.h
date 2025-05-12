// Author(s): Yuval Anteby
#ifndef BLOOM_FILTER_STATUS_CODE_UTILS_H
#define BLOOM_FILTER_STATUS_CODE_UTILS_H

#include <string>
#include "bloom/utils/status_code/BloomFilterStatusEnum.h"

std::string toStatusMessage(BloomFilterStatusEnum statusCode);

#endif
