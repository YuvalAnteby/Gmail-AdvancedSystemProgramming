// Author(s): Yuval Anteby
#ifndef IBLOOM_COMMAND_H
#define IBLOOM_COMMAND_H
/**
 * Interface for all commands related to the bloom filter.
 * Part of Command design pattern.
 */
class IBloomCommand {
public:
    virtual ~IBloomCommand() = default;

    /**
     * Executes the command's logic (inserts or checks a URL).
     */
    virtual void execute() = 0;
};

#endif