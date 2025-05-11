// Author(s): Yuval Anteby
#ifndef IOUTPUT_WRITER_H
#define IOUTPUT_WRITER_H

#include <string>
/**
* Interface responsible for all output.
* Used as part of the strategy design pattern for Input-Output
*/
class IOutputWriter {
  public:
    virtual ~IOutputWriter() = default;
    // output function
    virtual void writeData(std::string& line) = 0;
};

#endif
