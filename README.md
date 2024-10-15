# Проект "Управление реестром студентов-выпускников"

### Предварительные действия

Для установки и запуска проекта необходимо, чтобы в системе были установлены [docker](https://blog.skillfactory.ru/glossary/docker/) и [docker compose](https://1cloud.ru/blog/docker-compose).

- Docker:

  - #### Установка на Ubuntu - https://docs.docker.com/engine/install/ubuntu/

    Здесь docker как интерфейс командной строки.

  - #### Или, возможно, так будет удобнее: Docker Desktop - https://docs.docker.com/desktop/ 
    (сам не пробовал ставить так)



- Docker compose:
  - #### Установка на Ubuntu - https://docs.docker.com/compose/install/linux/
  - #### Или, docker compose входит в версию Desktop (см. выше)
    Как написано в документации:
    >The easiest and recommended way to get Docker Compose is to install Docker Desktop. Docker Desktop includes Docker Compose along with Docker Engine and Docker CLI which are Compose prerequisites.

    [_Полезные команды docker и docker compose_](https://timeweb.cloud/tutorials/docker/komandy-docker-spisok)
-----
### Установка и запуск в режиме разработчика

- Создать в корне проекта файл .env (в нем зададим значения переменных среды разработки)
- Скопировать в него переменные из .env.example (значения можно оставить, можно свои задать)
- Запустить команду ```docker compose up -d --build```
  
  Данная команда при первом запуске соберет и запустит контейнеры в фоновом режиме (опция -d)

  #### Ожидаемый результат
  ```
  $ docker compose ps
  NAME                               IMAGE                            COMMAND                  SERVICE             CREATED             STATUS                   PORTS
  register_of_graduates-nginx-1      register_of_graduates-nginx      "/docker-entrypoint.…"   nginx               6 minutes ago       Up 5 minutes             0.0.0.0:80->80/tcp, :::80->80/tcp
  register_of_graduates-postgres-1   register_of_graduates-postgres   "docker-entrypoint.s…"   postgres            2 minutes ago       Up 2 minutes (healthy)   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp
  register_of_graduates-react-1      register_of_graduates-react      "docker-entrypoint.s…"   react               6 minutes ago       Up 5 minutes             0.0.0.0:3050->3000/tcp, :::3050->3000/tcp
  ```
  Теперь можно перейти на http://localhost (там пока что страница сайта из примера с гитхаба с текстом Welcome to PNGR!)

### Продолжение следует...