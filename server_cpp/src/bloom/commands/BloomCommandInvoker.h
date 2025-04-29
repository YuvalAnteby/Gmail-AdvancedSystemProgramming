// Author(s): Yuval Anteby
#ifndef BLOOM_COMMAND_INVOKER_H
#define BLOOM_COMMAND_INVOKER_H

#include "IBloomCommand.h"
/**
 * Class reponsible on executing the correct command of the bloom filter.
 * Part of Command design pattern.
 */
class BloomCommandInvoker {
public:
    // Runs the given command
    void runCommand(IBloomCommand& command);
};

#endif