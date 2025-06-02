# Web Server

## Table of Contents
- [Running server and client](#testing-and-running)
    - [Getting started](#getting-started)
    - [Testing bloom filter server and python client](#to-test-the-pyton-client-and-bloom-filter-server)
    - [Running the web server](#running-the-servers)
- [Screenshots](#screenshots)
---

## Testing and Running
### Getting started
First clone the project
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming/python_client
```
And build it
```bash
  docker-compose build
```

#### Running the servers
**Make sure you already cloned the project and built it using docker compose** </br>
In case you want to change any configuration value (port, bloom filter integers etc.) change the relevant dockerfile or docker compose file.
Changing the port and the name of the cpp server also requires changing models/blacklist.js global vars (since we shouldn't include .env files)

- To run the web server and bloom filter server
```bash
  docker-compose up web_server
```

- Remainder, to exit the container gracefully use
```bash
control+c
```

## Screenshots
For screenshots [click here](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/main-Ex3/screenshots/ex3)
