cmake_minimum_required(VERSION 3.14)
project(Gmail-AdvancedSystemProgramming)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# For compiling the project itself
file(GLOB_RECURSE TEST_FILES
        src/utils/*.cpp
        src/network/*.cpp
        src/bloom/utils/BloomFilterCommandEnum.h
        src/bloom/utils/BloomFilterStatusEnum.h
        src/bloom/utils/*.cpp
        src/bloom/*.cpp
        src/bloom/commands/*.cpp
        src/bloom/hash/*.cpp
        src/bloom/models/*.cpp
        src/data_persistence/*.cpp
        src/strategyIO/*.cpp
        tests/*.cpp
        tests/utils_tests/*.cpp
)
# For compiling the tests
add_executable(runTests ${TEST_FILES})

# For compiling the project itself
file(GLOB_RECURSE SRC_FILES
        src/*.cpp
        src/utils/*.cpp
        src/network/*.cpp
        src/bloom/utils/BloomFilterCommandEnum.h
        src/bloom/utils/BloomFilterStatusEnum.h
        src/bloom/utils/*.cpp
        src/bloom/*.cpp
        src/bloom/commands/*.cpp
        src/bloom/hash/*.cpp
        src/bloom/models/*.cpp
        src/data_persistence/*.cpp
        src/strategyIO/*.cpp
)
add_executable(app ${SRC_FILES})

# Include directories
include_directories(src)
include_directories(src/data_persistence)

# Link gtest and gtest_main to runTests
target_link_libraries(runTests gtest gtest_main)