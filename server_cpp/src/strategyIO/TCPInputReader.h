// Author(s): Yuval Anteby
#ifndef SOCKET_INPUT_READER_H
#define SOCKET_INPUT_READER_H
/// TODO tests
#include "IInputReader.h"

/**
 * Class responsible on reading input from a user using a TCP connection to a client.
 * Using connection to a single client each time.
 */
class TCPInputReader : public IInputReader {
    const int m_clientSocket;

public:
    // Default constructor
    TCPInputReader(int clientSocket);

    std::string readLine() override;
};


#endif
