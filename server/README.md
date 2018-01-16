# Polyledger

> The backend API for the Polyledger platform

## Table of Contents

1. [Development](#development)
    - [Prerequisites](#prerequisites)
    - [API App](#api-app)
      - [Task Queue](#task-queue)
      - [Process for Adding New Coins](#process-for-adding-new-coins)
    - [Admin App](#admin-app)
2. [Database](#database)
    - [Development](#development)
    - [Staging and Production](#staging-and-production)
3. [Deployment](#deployment)
4. [Web Server](#web-server)
5. [Proxy Server](#proxy-server)

Install the latest version of Lattice:

```
❯ pip3 download --no-deps --dest ./vendor git+ssh://git@github.com/polyledger/lattice@VERSION
```

Then run `pip3 install -r requirements.txt`.

## Development

### Prerequisites

Before continuing, ensure you have Python 3.6 installed on your system (`python3 --version`).

Ensure that you've generated an SSH key on your MacBook. If you haven't generated one before, follow this [guide](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

Then copy the content of your public key to clipboard (`id_rsa.pub`)

```
❯ cat ~/.ssh/id_rsa.pub | pbcopy
```

In your GitHub account go to [Settings > SSH and GPG Keys](https://github.com/settings/keys) and add it.

### API app

Clone the repository to your home folder if you haven't already

```
❯ cd ~ && git clone https://github.com/polyledger/polyledger.git
```

Create a virtual environment inside `server` and activate it

```
❯ cd ./polyledger/server
❯ virtualenv venv -p python3.6
New python executable in /Users/home/polyledger/server/venv/bin/python
Installing setuptools, pip, wheel...done.
❯ source venv/bin/activate
```

Install requirements

```
(venv) ❯ pip3 install -r requirements.txt
```

Set up the environment variables inside your `~/.bash_profile` (this step may vary depending on your system configuration)

```
SECRET_KEY={A secret key goes here}
EMAIL_HOST_PASSWORD={The email host password goes here}

# Settings module will vary depending on the environment
DJANGO_SETTINGS_MODULE=polyledger.settings.local

# Only for production
POSTGRESQL_NAME={PostgreSQL name goes here}
POSTGRESQL_USER={PostgreSQL user goes here}
POSTGRESQL_PASSWORD={PostgreSQL password goes here}
```

Run the migrations

```
(venv) ❯ python3 manage.py migrate
```

Start the web application

```
(venv) ❯ python3 manage.py runserver 8000
```

Alternatively, you can use the shell script to start the app

```
(venv) ❯ ./start.sh server
```

The application should now be running at http://localhost:8000/api

#### Task Queue

The admin app uses a distributed task queue called [Celery](http://www.celeryproject.org/) to asynchronously perform tasks such as sending email, calculating allocations, and retrieving daily prices. These tasks can be found in `./api/tasks.py`.

To start the Celery task queue, use this command

```
./start.sh worker
```

Or alternatively, start redis with `redis-server` and run this command:

```
(venv) ❯ celery -E -A polyledger worker --loglevel=info -B
```

#### Process for Adding New Coins

1. Create a field for the coin in the `Price` model in `./api/models.py` and run the migration
2. Add the new coin fields to `PriceAdmin` `./api/admin.py` to make them viewable in the admin app
3. Ensure a 300x300 PNG image with a transparent background exists in `polyledger/client/src/assets/img/coins` (don't forget to run the build in production)
4. Create the new coin in the admin app (symbol, name, and slug)
5. Run the `fill_daily_historical_prices` task in `./api/tasks.py`

### Admin app

The admin app allows Polyledger admins to use an admin interface for managing content on the site. If the web server is already running, you can log in at these URLs:

Local:   http://localhost:8080/admin/
Staging: https://staging.polyledger.com/admin/

## Database

### Development

By default, Django uses a SQLite database for development.

### Staging and Production

The staging and production databases are accessible on the DigitalOcean respective droplets. There are currently two main PostgreSQL users: `postgres` and `admin`.

Log into the PostgreSQL database

```
❯ psql -U postgres --password -d polyledger_staging    # Staging
❯ psql -U postgres --password -d polyledger_production # Production
```

Start or stop PostgreSQL

```
❯ sudo service postgresql (start|stop)
```

Create a database

```
❯ psql postgres -U postgres
postgres=# CREATE DATABASE 'DATABASE_NAME';
CREATE DATABASE
postgres=> \q
```

Drop the database (staging environment only, do NOT run in production)

```
❯ dropdb -U postgres 'DATABASE_NAME'
```

## Deployment

The staging and production apps are hosted on [Digital Ocean](https://cloud.digitalocean.com) droplet instances. To access the droplets, you must have SSH key access.

```
❯ ssh root@192.241.220.209 # Staging
```

The app is located in `/var/www/staging.polyledger.com/polyledger`. To update from the master branch, run a git pull:

```
❯ git pull origin master
```

Don't forget to copy any new static assets to the static folder

```
❯ cd /var/www/staging.polyledger.com/polyledger/server
❯ source venv/bin/activate
(venv) ❯ python manage.py collectstatic
```

Then reload the app

```
(venv) ❯ pkill gunicorn
(venv) ❯ gunicorn polyledger.wsgi --bind 127.0.0.1:8000 &
(venv) ❯ bg

```

## Proxy Server

[Nginx](https://www.nginx.com/) is used as a proxy between incoming requests and the HTTP server. The configuration file is located at `/etc/nginx/sites-available/polyledger`.

Various helpful commands for Nginx:

```
❯ service nginx (start|stop|restart|reload|status)
```

Log locations:
- Access logs: `/var/log/nginx/access.log`
- Error logs: `/var/log/nginx/error.log`

For debugging purposes, it may be helpful to tail the log files like so:

```
❯ tail -f /var/log/nginx/error.log
```

## HTTP Server

[Gunicorn](http://gunicorn.org/) is the HTTP interface between Nginx and the Polyledger Django web application. Gunicorn processes the incoming API requests.

---

[Back to Main](./README.md)
