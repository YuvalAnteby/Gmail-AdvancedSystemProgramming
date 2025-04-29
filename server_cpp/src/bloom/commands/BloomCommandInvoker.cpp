// Author(s): Yuval Anteby
#include "BloomCommandInvoker.h"

/**
 * Run the given command of bloom filter
 * @param command a reference to the command class object of desired command (e.g. insert or check)
 */
void BloomCommandInvoker::runCommand(IBloomCommand& command) {
    command.execute();
}