// Author(s): Yuval Anteby
#include "TCPInputReader.h"

#include <sys/socket.h>


/**
 * Constructor. Gets the client info and gets info from it as input.
 * @param clientSocket socket's identifier to a client's connection
 */
TCPInputReader::TCPInputReader(const int clientSocket) : m_clientSocket(clientSocket) {
}

/**
 * Receive the data as input from a client
 * @return a string that was received as input
 */
std::string TCPInputReader::readLine() {
    char buffer[4096] = {};
    int readBytes = recv(m_clientSocket, buffer, sizeof(buffer), 0);
    if (readBytes < 0) {
        perror("error reading from client");
        return "";
    }
    return std::string(buffer, readBytes);
}