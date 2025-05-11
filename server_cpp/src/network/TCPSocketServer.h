// @Author(s): Yuval Anteby
#ifndef TCP_SOCKET_SERVER_H
#define TCP_SOCKET_SERVER_H
#include <stdexcept>


class TCPSocketServer {
    const int m_serverPort;
    const int m_maxClients;
    int m_serverSocket;
    int m_clientSocket;

public:
    // Constructor for server with support for only 1 client
    TCPSocketServer(int serverPort);

    // Constructor with a dynamic amount of max clients
    TCPSocketServer(int serverPort, int maxClients);

    // Destructor
    ~TCPSocketServer();

    bool acceptNewClient();

    int getClientSocket() const;
};


#endif
