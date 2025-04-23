#pragma once
#include <functional>
#include <string>
#include <vector>

std::vector<std::function<size_t(const std::string&)>> getHashFunctions(const std::vector<int>& hashIds);
