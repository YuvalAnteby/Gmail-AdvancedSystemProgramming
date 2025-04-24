# Gmail-AdvancedSystemProgramming

## Running locally with Docker
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
docker-compose build --no-cache app
docker-compose run --rm app
```

## Testing locally with Docker
```bash
git clone https://github.com/YuvalAnteby/Gmail-AdvancedSystemProgramming.git
cd Gmail-AdvancedSystemProgramming
docker-compose up --build gtest
```