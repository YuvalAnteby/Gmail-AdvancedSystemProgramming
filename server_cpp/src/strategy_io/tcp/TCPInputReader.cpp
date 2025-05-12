// Author(s): Yuval Anteby
#include "TCPInputReader.h"

#include <iostream>
#include <ostream>
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
    if (readBytes > 0) {
        std::cout << "received: " << std::string(buffer, readBytes) << std::endl;
        //return std::string(buffer, readBytes);
        return std::string(buffer, readBytes);
    }
    if (readBytes == 0) {
        std::cout << "connection closed" << std::endl;
        return "";
    }
    std::cout << "recv failed" << std::endl;
    return std::string("");
}