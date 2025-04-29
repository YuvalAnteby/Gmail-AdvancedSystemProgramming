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
- [Screenshots](#screenshots)

## Setting up & running the server

### clone
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
```
### build
```bash
docker-compose build app
```
### run
```bash
docker-compose run --rm app
```

### Deleting manually the .txt files (in terminal)
```bash
docker run --rm -v gmail-advancedsystemprogramming_app_data:/data alpine sh -c "rm -f /data/build/data/*.txt"
```

### Rebuilding the code in case of code errors (deletes .txt files)
```bash
docker-compose down -v
docker-compose build app
docker-compose run --rm app
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

## Screenshots

<details>
<summary>Click to expand screenshots</summary>

<img src="../screenshots/BloomFilter/example%20run%201.png" height="500" alt="img1">
<img src="../screenshots/BloomFilter/example%20run%202.png" height="500" alt="img2">
<img src="../screenshots/BloomFilter/example%20run%203.png" height="500" alt="img3">
<img src="../screenshots/BloomFilter/test%20results.png" height="500" alt="img4">

</details>

---
