# Gmail-AdvancedSystemProgramming
Daily meeting summaries are uploaded to `Issues` tab
Roee's miluim service documents are uploaded to `Issues` tab if needed, Tzvika was informed about it.

## Dear TA please check main-Ex5 for the final version of Ex5
## Dear TA please check main-Ex4 for the final version of Ex4

---

## Table of Contents
- [Running server and client](#testing-and-running)
  - [Getting started](#getting-started)
  - [Testing bloom filter server and python client](#to-test-the-python-client-and-bloom-filter-server) 
  - [Running as web application project](#running-the-entire-web-app)
  - [env variables](#env-variables)
  - [Running the android app](#running-the-android-app)
- [Screenshots](#screenshots)
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
**If you want to change the configuration (ports, names, bloom filter integers etc.) you can do it in dockerfiles 
and docker compose.**

### To test the python client and bloom filter server
This will build and run only the test related containers (CPP server, gtest, python test)
```bash
  docker-compose --profile tests up --build
```

### Running the entire web app
This will build and run only the web application related containers (React, Node.js, CPP server)
```bash
  docker compose --profile web_app up -d --build web_server mongo
```

#### env variables
In Node.js and React root folders you can find .env files with default values to help you check the project.</br>
In a real world application these wouldn't be uploaded, we did it for easier set up for the checkers :)

### Running the python client
**NOTE: The instructions didn't ask to run the python client and express server together using the same command**
```bash
  docker-compose run client --build
```

- Remainder, to exit the container gracefully use
```bash
control+c
```

### Running the android app
0. ensure the backend is running using docker using the previous instructions
1. Download and install the official android studio software
2. Set up an emulator device using an API version of 26 or greater (most modern phones will suffice)
3. You can install the project's app using 2 versions:
  - Easy way:
     1. get from the root folder the given APK file
     2. ensure the emulator's device is up and running
     3. drag the file to the emulator's window, it will be installed in it
  - The Custom way:
      1. Open android studio when targeting the folder `android_app` instead of the root folder
      2. Wait for android studio to finish the intial gradle build of the project
      3. click on the green run button using the built in tools and set up to your desire

- in case you need to change the backend's API URL you can do so in `gradle.properties` located in the sub root folder `android_app`
---

### Screenshots
<details>
<summary>Click to expand Ex5 screenshots</summary>

<img src="https://github.com/user-attachments/assets/4f686aa6-ce6b-4d6b-8761-e5fb23bb39e5" width="30%" height="30%"/>
<img src="https://github.com/user-attachments/assets/e5cf56f3-2df7-48c7-a2f8-fb10880f50c0" width="30%" height="30%"/>
<img src="https://github.com/user-attachments/assets/0bd243d9-17cf-4341-9bb1-261eb755b28b" width="30%" height="30%"/>
<img alt="inbox_dark" src="https://github.com/user-attachments/assets/86b0e76e-7d78-4547-86ae-651292662b38" width="30%" height="30%"/>
<img alt="inbox_light" src="https://github.com/user-attachments/assets/f6562d27-28ad-4d06-9446-6cbeb2909fb4" width="30%" height="30%"/>
<img alt="reading_dark" src="https://github.com/user-attachments/assets/cc25bb1d-0659-43fa-a933-4b6ee5ce1bd3" width="30%" height="30%"/>

</details>

For more screenshots [click here](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/tree/main-Ex5/screenshots/ex5)

---

## Useful links
- [CPP server README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/blob/main-Ex4/server_cpp)
- [JavaScript server README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/blob/main-Ex4/web_server/README.md)
- [React frontend README](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/blob/main-Ex4/frontend/README.md)

---
