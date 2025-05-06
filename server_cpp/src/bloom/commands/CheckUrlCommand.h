// Author(s): Yuval Anteby
#ifndef CHECK_URL_COMMAND_H
#define CHECK_URL_COMMAND_H

#include <strategyIO/IOutputWriter.h>

#include "IBloomCommand.h"
#include "data_persistence/IDataPersistence.h"
#include "bloom/models/BloomCommandResult.h"

/**
 * Class responsible for the check command of URLs against the bloom filter.
 * Part of Command design pattern.
 */
class CheckUrlCommand : public IBloomCommand {
private:
    std::string url;
    IDataPersistence& persistence;
    std::vector<int> configInts;
    int size; 
    BloomCommandResult m_bloomResult;

    bool possiblyContains(
        const std::string& url,
        int size,
        const std::vector<int>& counts,
        const std::vector<std::vector<bool>>& candidates
    );

    bool matchesURL(const std::string& url, const std::vector<std::string>& list);

public:


    /**
     * Constructor
     * @param url a URL we want to check if is in the bloom filter
     * @param persistence reference to the data management tool to check with (e.g. .txt file or DB)
     * @param configInts array of the config ints
     * @param size bit array size
     */
    CheckUrlCommand(
        const std::string& url,
        IDataPersistence& persistence,
        const std::vector<int>& configInts,
        int size
        );

    /**
    * Execute the check URL command.
    * Will call relevant functions to check if a given URL is in the blooom filter.
    */
    void execute() override;

    BloomCommandResult getResult() override;
};

#endif