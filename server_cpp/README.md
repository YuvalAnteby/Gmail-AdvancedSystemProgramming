# CPP server

## Table of Contents
- [Setting up the server](#setting-up--running-the-server)
  1. [Clone](#clone)
  2. [Build](#build)
  3. [run](#run)
  4. [Deleting manually .txt files in docker (from terminal)](#deleting-manually-the-txt-files-in-terminal)
- [Exiting the docker container in terminal](#reminder-exiting-the-docker-container)
- [Rebuilding the code in case of code errors](#rebuilding-the-code-in-case-of-code-errors-deletes-txt-files)
- [Testing locally with Docker](#testing-locally-with-docker)

## Setting up & running the server
- <b>note</b>: we use default values for the command line arguments, if you would like to change do it from docker
### clone
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
```
### build
```bash
docker-compose build run_server
```
### run
```bash
docker-compose run --rm runServer
```

### Deleting manually the .txt files (in terminal)
```bash
docker run --rm -v gmail-advancedsystemprogramming_app_data:/data alpine sh -c "rm -f /data/build/data/*.txt"
```

### Rebuilding the code in case of code errors (deletes .txt files)
```bash
docker-compose down -v
docker-compose build run_server
docker-compose up run_server
```

### Testing locally with Docker
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
docker-compose run --build --rm gtest
```

### (Reminder) Exiting the docker container
```bash
control + d
```
or 
```bash
control + c
```

---
