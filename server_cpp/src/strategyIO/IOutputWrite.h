// Author(s): Yuval Anteby
#ifndef IOUTPUT_WRITE_H
#define IOUTPUT_WRITE_H

#include <string>
/**
* Interface responsible for all output.
* Used as part of the strategy design pattern for Input-Output
*/
class IOutputWrite {
  public:
    virtual ~IOutputWrite() = default;
    // output function
    virtual void writeData(std::string line) = 0;
};

#endif
