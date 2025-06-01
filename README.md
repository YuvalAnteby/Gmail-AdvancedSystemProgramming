# Gmail-AdvancedSystemProgramming

## Dear TA please check main-Ex1 for the final version of Ex1
## Dear TA please check main-Ex2 for the final version of Ex2
## Dear TA please check main-Ex3 for the final version of Ex3

---

## Table of Contents
- [Running server and client](#testing-and-running)
  - [Getting started](#getting-started)
  - [Testing bloom filter server and python client](#to-test-the-pyton-client-and-bloom-filter-server) 
  - [Running the web server](#running-the-servers)

- [Screenshots & routes examples](#screenshots)
  - [Ex3](#ex3-screenshots)
- [Useful links](#useful-links)
  - [CPP server README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/tree/main-Exe/server_cpp) 
  - [Python client README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/blob/main-Ex3/python_client/README.md)
  - [JavaScript server README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/blob/main-Ex3/web_server/README.md)

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

### To test the pyton client and bloom filter server
**Make sure you already cloned the project and built it using docker compose**
```bash
  docker-compose run --build --rm gtest
  docker-compose run --build --rm test_client
```

#### Running the servers
**Make sure you already cloned the project and built it using docker compose** </br>
In case you want to change any configuration value (port, bloom filter integers etc.) change the relevant dockerfile or docker compose file. </br>
Changing the port and the name of the cpp server also requires changing models/blacklist.js global vars (since we shouldn't include .env files)

- To run the web server and bloom filter server
```bash
  docker-compose up web_server
```
- To run the python client 
```bash
  docker-compose run python_client
```
**NOTE: The Ex3 instructions didn't ask to run the python client and express server together using the same command**

- Remainder, to exit the container gracefully use
```bash
control+c
```

---

### Screenshots
#### Ex3 screenshots
<details>
<summary>Click to expand Ex3 screenshots</summary>

<img src="screenshots/ex3/curl runexample1.png" height="50%" alt="">
<img src="screenshots/ex3/curl runexample2.png" height="50%" alt="">
<img src="screenshots/ex3/curl runexample3.png" height="50%" alt="">
<img src="screenshots/ex3/curl runexample4.png" height="50%" alt="">
<img src="screenshots/ex3/curl runexample5.png" height="50%" alt="">

</details>

For more screenshots [click here](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/main-Ex3/screenshots/ex3)

---

## Useful links
- [CPP server README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/tree/main-Exe/server_cpp)
- [Python client README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/blob/main-Ex3/python_client/README.md)
- [JavaScript server README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/blob/main-Ex3/web_server/README.md)

---

