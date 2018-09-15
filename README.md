# Connect

![Screenshot](/polyledger.png?raw=true)

> Cryptoasset portfolio management app

---

## Prerequisites

- [Docker](https://www.docker.com/community-edition) installed on your system.

## Quick Start

Clone this repository:

```
❯ git clone https://github.com/polyledger/polyledger.git
```

You must install the web client's dependencies before running the application in Docker:

```
❯ cd polyledger/web_client && npm install
```

You will need a file containing your environment variables (either `.env.development` or `.env.production`) at the project root. The contents should contain these variables:

```
SECRET_KEY=<secret_key>
PYTHON_ENV=<development|production>
EMAIL_HOST_PASSWORD=<email_host_password>
DJANGO_SETTINGS_MODULE=polyledger.settings.<local|production>
```

Now you can build the Docker containers:

```
❯ cd .. && docker-compose build
```

## Development

Start the development services:

```
❯ docker-compose up
```

If you have fresh volumes and containers, you can pre-populate the database. It will create a user that can log into the [app](http://localhost:3000/login) and [admin interface](http://localhost:8000/admin/login). Just run these commands in a separate shell:

```
❯ container_id=$(docker-compose ps -q server)
❯ docker exec -it $container_id python manage.py loaddata initial_data.json --app api
```

If you pre-populate the database, 10 coins will also be created. To fetch prices, run the following:

```
❯ docker exec -it $container_id python manage.py shell
```

This will launch an interactive Python shell. You can call the task to fetch prices:

```python
>>> from api.tasks import fill_historical_prices
>>> fill_historical_prices()
```

---

## Production

Start the production services:

```
❯ docker-compose -f production.yml up
```
