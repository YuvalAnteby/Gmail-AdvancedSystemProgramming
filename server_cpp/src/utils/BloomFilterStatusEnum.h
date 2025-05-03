// Author(s): Yuval Anteby
#ifndef BLOOM_FILTER_STATUS_ENUM_H
#define BLOOM_FILTER_STATUS_ENUM_H

/**
* Enum to use for status codes, values set per the assigment instructions.
*/
enum BloomFilterStatusEnum {
  NONE = -1,
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404
};

#endif