// Author(s): Yuval Anteby
#ifndef DELETE_URL_COMMAND_H
#define DELETE_URL_COMMAND_H


#include "./strategy_io/IOutputWriter.h"
#include "IBloomCommand.h"
#include "data_persistence/IDataPersistence.h"
#include "bloom/result//BloomCommandResult.h"

class DeleteUrlCommand : public IBloomCommand {
    std::string m_url;
    IDataPersistence &m_persistence;
    BloomCommandResult m_bloomResult;
    IOutputWriter &m_outputWriter;

public:
    /**
     * Constructor
     * @param url URL to be deleted
     * @param persistence reference to the data management tool to check with (e.g. .txt file or DB)
     * @param outputWriter object responsible on output to wherever we want
     */
    DeleteUrlCommand(const std::string& url, IDataPersistence& persistence, IOutputWriter& outputWriter);

    /**
     * Execute the check URL command.
     * Will call relevant functions to check if a given URL is in the blooom filter.
     */
    void execute() override;

    BloomCommandResult getResult() override;
};


#endif
