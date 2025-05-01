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
        server_cpp/src/utils/*.cpp
        server_cpp/src/bloom/*.cpp
        server_cpp/src/bloom/commands/*.cpp
        server_cpp/src/bloom/hash/*.cpp
        server_cpp/src/data_persistence/*.cpp
tests/*.cpp
tests/utils_tests/*.cpp
)
# For compiling the tests
add_executable(runTests ${TEST_FILES})

# For compiling the project itself
file(GLOB_RECURSE SRC_FILES
        server_cpp/src/*.cpp
        server_cpp/src/utils/*.cpp
        server_cpp/src/bloom/*.cpp
        server_cpp/src/bloom/commands/*.cpp
        server_cpp/src/bloom/hash/*.cpp
        server_cpp/src/data_persistence/*.cpp
)
add_executable(app ${SRC_FILES})

# Include directories
include_directories(server_cpp/src)
include_directories(server_cpp/src/data_persistence)

# Link gtest and gtest_main to runTests
target_link_libraries(runTests gtest gtest_main)