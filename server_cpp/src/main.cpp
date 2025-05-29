#include <vector>
#include <string>
#include <mutex>
#include "data_persistence/FilePersistence.h"    // concrete persistence implementation
#include "strategy_io/utils/InputValidation.h" // argument validation utilities
#include "server_runner/ServerRunner.h"        // runServer declaration
#include "strategy_io/utils/BloomInputProccesor.h"  // input processing for bloom filter

static std::mutex persistenceMutex;  // protects shared data persistence

int main(int argc, char* argv[]) {
    int port, bloomSize;
    std::vector<int> configInts;  // holds bloom configuration values

    // validate command-line arguments
    if (!isValidArgs(argc, argv)) {
        return EXIT_FAILURE;
    }

    // initialize data persistence
    IDataPersistence* dataSource = new FilePersistence();

    // parse remaining args into port, bloomSize, configInts
    processInput(argc, argv, port, bloomSize, configInts, *dataSource);

    // start the server loop with shared data
    int result = runServer(
            port,
            bloomSize,
            configInts,
            dataSource,
            &persistenceMutex
    );

    return result; // return server exit code
}
