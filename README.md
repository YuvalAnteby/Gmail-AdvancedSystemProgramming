# Gmail-AdvancedSystemProgramming

## Set up the app
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
docker-compose build app
```
### Testing locally with Docker
```bash
docker-compose run --build --rm gtest
```
### Running locally with Docker
```bash
docker-compose run --rm app
```
### (Reminder) Exiting the docker container
```bash
control + d
```
or 
```bash
control + c
```
### Deleting manually the .txt files (in terminal)
```bash
docker run --rm -v gmail-advancedsystemprogramming_app_data:/usr/src/app/build/data alpine sh -c "rm -f /usr/src/app/build/data/*.txt"
```