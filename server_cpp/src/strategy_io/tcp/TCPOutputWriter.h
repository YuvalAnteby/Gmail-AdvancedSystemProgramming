// Author(s): Yuval Anteby
#ifndef SOCKET_OUTPUT_WRITER_H
#define SOCKET_OUTPUT_WRITER_H
#include "./strategy_io/IOutputWriter.h"

/**
 * Class to be responsible on sending data from the server to a client using TCP connection.
 * Using connection to a single client each time.
 */
class TCPOutputWriter : public IOutputWriter {
    const int m_clientSocket;

public:
    // Default constructor
    TCPOutputWriter(int clientSocket);

    void writeData(std::string &line) override;
};

#endif
