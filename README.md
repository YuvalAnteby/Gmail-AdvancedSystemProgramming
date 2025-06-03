# Gmail-AdvancedSystemProgramming
Daily meeting summaries are uploaded to `Issues` tab
## Dear TA please check main-Ex1 for the final version of Ex1
## Dear TA please check main-Ex2 for the final version of Ex2
## Dear TA please check main-Ex3 for the final version of Ex3

---

## Table of Contents
- [Running server and client](#testing-and-running)
  - [Getting started](#getting-started)
  - [Testing bloom filter server and python client](#to-test-the-python-client-and-bloom-filter-server) 
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
**If you want to change the configuration (ports, names, bloom filter integers etc.) you can do it in dockerfiles and docker compose.**

### To test the python client and bloom filter server
This will build and run only the test related containers (CPP server, gtest, python test)
```bash
  docker-compose --profile tests up --build
```

### Running the entire web app
This will build and run only the web application related containers (react, Node.js, CPP server)
```bash
  docker-compose --profile web_app up --build
```

### Running the python client
**NOTE: The instructions didn't ask to run the python client and express server together using the same command**
```bash
  docker-compose run client --build
```

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

