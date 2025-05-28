#pragma once
#include <vector>
#include <mutex>
#include "../data_persistence/IDataPersistence.h"

int runServer(
        int port,
        int bloomSize,
        const std::vector<int>& configInts,
        IDataPersistence* dataSource,
        std::mutex* dataMutex
);
