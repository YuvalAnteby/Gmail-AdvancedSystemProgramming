// Author(s): Yuval Anteby
#ifndef TCP_INPUT_READER_H
#define TCP_INPUT_READER_H
#include "./strategy_io/IInputReader.h"

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
