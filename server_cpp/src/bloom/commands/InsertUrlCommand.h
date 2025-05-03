// Author(s): Yuval Anteby
#ifndef INSERT_URL_COMMAND_H
#define INSERT_URL_COMMAND_H

#include "IBloomCommand.h"
#include "data_persistence/IDataPersistence.h"

/**
 * Class responsible for the insertion command of URLs to the bloom filter.
 * Part of Command design pattern.
 */
class InsertUrlCommand : public IBloomCommand {
private:
    std::string url;
    IDataPersistence& persistence;
    std::vector<int> configInts;
    int size; 
    BloomCommandResult m_bloomResult;

public:
    /**
     * Constructor
     * @param url a URL to be inserted to the bloom filter
     * @param persistence reference to the data management tool to insert to (e.g. .txt file or DB)
     */
    InsertUrlCommand(const std::string& url, IDataPersistence& persistence,const std::vector<int>& configInts, int size);

    // execute insertion command
    void execute() override;

    BloomCommandResult getResult() override;
};

#endif