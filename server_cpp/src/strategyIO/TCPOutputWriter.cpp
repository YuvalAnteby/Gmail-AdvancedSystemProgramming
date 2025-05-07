// Author(s): Yuval Anteby

#include "TCPOutputWriter.h"

#include <sys/socket.h>

/**
 * Constructor. Gets the client info and send the info using it
 * @param clientSocket socket's identifier to a client's connection
 */
TCPOutputWriter::TCPOutputWriter(const int clientSocket) : m_clientSocket(clientSocket) {
}

/**
 * Send the data to print to the client
 * @param line line of text to send and print
 */
void TCPOutputWriter::writeData(std::string &line) {
    int send_bytes = send(m_clientSocket, line.c_str(), line.size(), 0);
    if (send_bytes < 0) {
        perror("error sending to client");
    }
}
