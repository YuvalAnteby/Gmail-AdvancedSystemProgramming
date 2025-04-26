# Gmail-AdvancedSystemProgramming

## Set up the app
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
docker-compose build app
```
### Running locally with Docker
```bash
docker-compose run --rm app
```
### Testing locally with Docker
```bash
docker-compose run --build gtest
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
docker run --rm -v gmail-advancedsystemprogramming_app_data:/data alpine sh -c "rm -f /data/*.txt"
```