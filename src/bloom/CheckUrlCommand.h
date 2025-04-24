// Author(s): Yuval Anteby
#ifndef CHECK_URL_COMMAND_H
#define CHECK_URL_COMMAND_H

#include "IBloomCommand.h"
#include "data_persistence/IDataPersistence.h"

/**
 * Class responsible for the check command of URLs against the bloom filter.
 * Part of Command design pattern.
 */
class CheckUrlCommand : public IBloomCommand {
private:
    std::string url;
    IDataPersistence& persistence;
    bool result;

    bool possiblyContains(
        const std::string& url,
        int size,
        const std::vector<int>& counts,
        const std::vector<std::vector<bool>>& candidates
    );

public:
    /**
     * Constructor
     * @param url a URL we want to check if is in the bloom filter
     * @param persistence reference to the data management tool to check with (e.g. .txt file or DB)
     */
    CheckUrlCommand(const std::string& url, IDataPersistence& persistence);
    /**
    * Excute the check URL command.
    * Will call relevant functions to check if a given URL is in the blooom filter.
    */
    void execute() override;
    /**
     * getter for result
     */
    bool wasFound() const;
};

#endif