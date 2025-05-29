#pragma once
#include <vector>
#include <mutex>
#include "../data_persistence/IDataPersistence.h"

/**
 * Starts the server with the given configuration.
 *
 * @param port Port number on which the server should listen.
 * @param bloomSize Size of the Bloom filter to be used.
 * @param configInts Additional configuration integers for server setup.
 * @param dataSource Pointer to the data persistence interface (used to access or store data).
 * @param dataMutex Pointer to the mutex used for synchronizing access to the data source.
 * @return 0 on successful execution, or a non-zero error code.
 */
int runServer(
        int port,
        int bloomSize,
        const std::vector<int>& configInts,
        IDataPersistence* dataSource,
        std::mutex* dataMutex
);
