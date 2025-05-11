// @Author(s): Yuval Anteby
#include "TCPSocketServer.h"

#include <cstring>
#include <netinet/in.h>
#include <iostream>
#include <unistd.h>

/**
 * Constructor, sets up the server and needed socket info for it.
 * Enables at most one client to be connected to the server.
 * Will close all connection in destructor
 * @param serverPort port to be used by the server
 * @throws std::runtime_error if reached an error on binding or listening
 */
TCPSocketServer::TCPSocketServer(int serverPort) : TCPSocketServer(serverPort, 1) {
}

/**
 * Constructor, sets up the server and needed socket info for it.
 * @param serverPort port to be used by the server
 * @param maxClients max amount of clients the connection will support
 * @throws std::runtime_error if reached an error on binding or listening
 */
TCPSocketServer::TCPSocketServer(int serverPort, int maxClients)
    : m_serverPort(serverPort), m_maxClients(maxClients), m_serverSocket(-1), m_clientSocket(-1) {
    // set the socket to use TCP with a default protocol, in case of error print it
    m_serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (m_serverSocket < 0) {
        perror("error creating socket");
    }
    // create a struct to define the server and zeroize the struct as a default
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    // set the values in the struct. accepting connection from any IP
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(m_serverPort);
    // bind the socket to the server's IP+port, print if there's an error
    if (bind(m_serverSocket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
        throw std::runtime_error("Failed to bind socket");
    }

}

/**
 * Accept a connection from a new client (if possible)
 * @return true if managed to connect successfully, otherwise false
 */
bool TCPSocketServer::acceptNewClient() {
    // Check if we exceeded the max amount of connections
    if (listen(m_serverSocket, m_maxClients) < 0) {
        perror("error listening on socket");
        throw std::runtime_error("Failed to listen on socket");
    }
    sockaddr_in client_sin{};
    unsigned int addr_len = sizeof(client_sin);
    m_clientSocket = accept(m_serverSocket, (struct sockaddr *) &client_sin, &addr_len);
    if (m_clientSocket < 0) {
        perror("error accepting client");
        return false;
    }
    return true;
}

/**
 * Getter for the client socket
 * @return int of the client connection to the server
 */
int TCPSocketServer::getClientSocket() const {
    return m_clientSocket;
}

TCPSocketServer::~TCPSocketServer() {
    if (m_clientSocket != -1) {
        close(m_clientSocket);
    }
    if (m_serverSocket != -1) {
        close(m_serverSocket);
    }
}
