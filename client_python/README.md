# Python Client

## Table of Contents
- [Setting up and running the client](#setting-up-and-running-the-client)
  1. [Clone](#clone)
  2. [Build](#build)
  3. [Run](#run)
- [Manual execution with custom IP and port](#manual-execution-with-custom-ip-and-port)
- [Exiting the docker container in terminal](#exiting-the-docker-container-in-terminal)
- [Rebuilding the client container](#rebuilding-the-client-container)
- [Testing locally with Docker](#testing-locally-with-docker)
- [Reminder: Exiting the Docker container](#reminder-exiting-the-docker-container)
- [Screenshots](#screenshots)

---

## Setting up and running the client.

### Clone
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming/client_python
 

 
### build
```bash
docker-compose build app
```
### run
```bash
docker-compose run --rm app
```

### Rebuilding the code in case of code errors (deletes .txt files)
```bash
docker-compose down -v
docker-compose build app
docker-compose run --rm app
```
