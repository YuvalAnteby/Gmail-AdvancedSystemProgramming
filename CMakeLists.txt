cmake_minimum_required(VERSION 3.10)
project(Gmail-AdvancedSystemProgramming)


set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# For compiling the tests
add_executable(runTests tests/test_main.cpp)
# For compiling the project itself
add_executable(app src/main.cpp)

target_link_libraries(runTests gtest_main)