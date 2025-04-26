# Gmail-AdvancedSystemProgramming

## Set up the app
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
```
1. build
```bash
docker-compose build app
```
2. run
```bash
docker-compose run --rm app
```
3. Deleting manually the .txt files (in terminal)
```bash
docker run --rm -v gmail-advancedsystemprogramming_app_data:/data alpine sh -c "rm -f /data/build/data/*.txt"
```

### (Reminder) Exiting the docker container
```bash
control + d
```
or 
```bash
control + c
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

<img src="screenshots/BloomFilter/example run 1.png" height="500" alt="img1">
<img src="screenshots/BloomFilter/example run 2.png" height="500" alt="img2">
<img src="screenshots/BloomFilter/example run 3.png" height="500" alt="img3">
