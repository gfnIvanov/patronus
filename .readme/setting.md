### Настройка

Создать файл .env в корне проекта и указать токен бота (образец в .env.default)

При развертывании на сервере:

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
