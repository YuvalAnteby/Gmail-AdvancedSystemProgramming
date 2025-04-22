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

# For compiling the tests
add_executable(
  runTests
  tests/test_main.cpp
  src/bloom_filter/BloomFilter.cpp
  src/data_persistence/FilePersistence.cpp
  tests/data_persistence_tests/FilePersistenceTests.cpp
  src/data_persistence/FilePersistence.cpp
)
# For compiling the project itself
add_executable(app src/main.cpp)

include_directories(src)
include_directories(src/data_persistence)
target_link_libraries(runTests gtest_main)

