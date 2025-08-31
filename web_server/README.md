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
In case you want to change any configuration value related to the bloom filter (port, bloom filter integers etc.) change the relevant dockerfile or docker compose file.

- To run the web server and MongoDB via compose (profile web_app)
```bash
docker compose --profile web_app up -d --build web_server mongo
```

- Environment
  - Ensure `.env` exists in `web_server/` or use `.env.example` as a template.
  - `MONGO_URI` should be `mongodb://mongo:27017/appdb` when using compose.

- Health check
```bash
curl http://localhost:3001/health
```

- Dev routes
  - Disabled by default in `app.js` (commented `app.use('/dev/*', ...)`).
  - Uncomment locally only if you need seed/list endpoints for debugging.

- To run the web server and bloom filter server
```bash
  docker-compose up web_server
```

- Remainder, to exit the container gracefully use
```bash
control+c
```

## Screenshots
For screenshots [click here](https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming/main-Ex4/screenshots/ex4)
