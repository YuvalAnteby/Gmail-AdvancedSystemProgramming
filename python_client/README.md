# Python Client

## Table of Contents
- [Setting up and running the client](#setting-up-and-running-the-client)
  1. [Clone](#clone)
  2. [Build](#build)
  3. [Run](#run)
- [Rebuilding the client container](#rebuilding-the-client-container)
- [Testing locally with Docker](#run-the-tests)

---

## Setting up and running the client.
- <b>note</b>: we use default values for the command line arguments, if you would like to change do it from docker
### Clone

```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming/python_client
``` 
 
### build

```bash
docker-compose build python_client
```
### run

```bash
docker-compose run --rm python_client
```
# Run the tests

```bash
docker-compose run --build test_client
```

### Rebuilding the client container

```bash
docker-compose down -v
docker-compose build python_client
docker-compose run --rm python_client
```
