### Настройка

Создать файл .env в корне проекта и указать токен бота (образец в .env.default)

```touch .env && echo BOT_TOKEN='...' >> .env```

Для взаимодействия с БД через консоль в корне проекта выполнить ```npm link```

Доступные для взаимодействия с БД команды ```patronus --help```

При развертывании на сервере:

- клонировать репозиторий
- глобально установить pm2 
- установить nodejs через nvm

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash

$ chmod +x ~/.nvm/nvm.sh

$ source ~/.bashrc 

$ nvm install 16
```
- перенести файлы базы данных и содержимое папки public

```
scp -r /Users/igorivanov/dev/projects/patronus/public/ root@ip_adress:/root/patronus/public
```
