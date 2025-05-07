// Author(s): Yuval Anteby
#include "TCPInputReader.h"

#include <sys/socket.h>


/**
 * Constructor. Gets the client info and gets info from it as input.
 * @param clientSocket TODO comments
 * @return 
 */
TCPInputReader::TCPInputReader(const int clientSocket) : m_clientSocket(clientSocket) {
}

/**
 * TODO comments
 * @return
 */
std::string TCPInputReader::readLine() {
    char buffer[4096] = {0};
    int readBytes = recv(m_clientSocket, buffer, sizeof(buffer), 0);
    if (readBytes < 0) {
        perror("error reading from client");
        return "";
    }
    return std::string(buffer, readBytes);
}