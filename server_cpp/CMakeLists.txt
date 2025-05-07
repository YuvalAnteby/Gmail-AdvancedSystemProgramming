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

# ----- Building CPP server -----
file(GLOB_RECURSE SRC_FILES CONFIGURE_DEPENDS src/*.cpp)
add_executable(runServer ${SRC_FILES})
# ----- Building CPP server -----

# ----- Building unit tests -----
file(GLOB_RECURSE TEST_FILES CONFIGURE_DEPENDS tests/*.cpp)
set(TEST_FILES_LIST ${SRC_FILES} ${TEST_FILES})
list(FILTER TEST_FILES_LIST INCLUDE REGEX "tests/.*\\.cpp")
list(FILTER TEST_FILES_LIST EXCLUDE REGEX "src/main.cpp")
list(APPEND TEST_FILES_LIST tests/test_main.cpp)
add_executable(runTests ${TEST_FILES_LIST})
# ----- Building unit tests -----

include_directories(src)
# Link gtest and gtest_main to runTests
target_link_libraries(runTests gtest gtest_main)