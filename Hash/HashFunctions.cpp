#include "hash/HashFunctions.h"
#include <functional>
#include <string>

std::vector<std::function<size_t(const std::string&)>> getHashFunctions(const std::vector<int>& hashIds) {
    std::vector<std::function<size_t(const std::string&)>> funcs;
    for (int id : hashIds) {
        if (id == 1) {
            funcs.push_back([](const std::string& s) {
                return std::hash<std::string>{}(s);
            });
        } else if (id == 2) {
            funcs.push_back([](const std::string& s) {
                return std::hash<std::string>{}(std::to_string(std::hash<std::string>{}(s)));
            });
        }
    }
    return funcs;
}
