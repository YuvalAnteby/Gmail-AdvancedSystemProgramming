// @Author(s): Yuval Anteby

#ifndef IINPUT_READER_H
#define IINPUT_READER_H

#include <string>

/**
 * Interface responsible for all input.
 * Used as part of the strategy design pattern for Input-Output
 */
class IInputReader {
  public:
    virtual ~IInputReader() = default;
    // input function
    virtual bool readLine(std::string line) = 0;
};

#endif
