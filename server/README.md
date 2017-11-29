## Table of Contents

1. [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Account app](#account-app)
    - [Admin app](#admin-app)
2. [Deployment](#deployment)
    - [Database](#database)

## Development

### Prerequisites

Before continuing, ensure you have Python 3.6 installed on your system (`python3 --version`).

Ensure that you've generated an SSH key on your MacBook. If you haven't generated one before, follow this [guide](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

Then copy the content of your public key to clipboard (`id_rsa.pub`)

```
❯ cat ~/.ssh/id_rsa.pub | pbcopy
```

In your GitHub account go to [Settings > SSH and GPG Keys](https://github.com/settings/keys) and add it.

### Account app

Clone the repository to your home folder

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

Set up the environment variables (this step may vary depending on your system configuration)

```
(venv) ❯ echo "
dquote> SECRET_KEY={A secret key goes here}
dquote> EMAIL_HOST_PASSWORD={The email host password goes here}
dquote> PLAID_CLIENT_ID={Plaid client ID goes here}
dquote> PLAID_SECRET={Plaid secret key goes here}
dquote> STRIPE_SECRET={Stripe secret key goes here}
dquote> GDAX_API_KEY={GDAX API key goes here}
dquote> GDAX_SECRET_KEY={GDAX secret key goes here}
dquote> GDAX_PASSPHRASE={GDAX passphrase goes here}
dquote> POSTGRESQL_NAME={PostgreSQL name goes here}
dquote> POSTGRESQL_USER={PostgreSQL user goes here}
dquote> POSTGRESQL_PASSWORD={PostgreSQL password goes here}
dquote> DJANGO_SETTINGS_MODULE=polyledger.settings.local
dquote>" >> ~/.bash_profile
```

Run the migrations

```
(venv) ❯ python manage.py migrate
```

Start the web application

```
(venv) ❯ python3 manage.py runserver 8080
```

Alternatively, you can use the shell script to start the app

```
(venv) ❯ ./start.sh server
```

The application should now be running at http://localhost:8080/account/login

### Admin app

The admin app allows Polyledger admins to use an admin interface for managing content on the site. If the web server is already running, you can log in at http://localhost:8080/admin/.

## Deployment

The staging and production apps are hosted on [Digital Ocean](https://cloud.digitalocean.com) droplet instances. To access the droplets, you must have SSH key access.

```
❯ ssh root@192.241.220.209 # Staging
❯ ssh root@107.170.200.103 # Production
```

The app is located in `/home/polyledger`. To update from the master branch, run a git pull:

```
❯ git pull origin master
```

Don't forget to copy any new static assets to the static folder

```
❯ source ./server/venv/bin/activate
(venv) ❯ python manage.py collectstatic
```

Then reload the app

```
❯ /home/polyledger/server/venv/bin/gunicorn polyledger.wsgi --bind 127.0.0.1:8001 --reload &
❯ bg

```

### Database

Log into the PostgreSQL database

```
❯ psql -U admin --password -d polyledger_staging # Staging
❯ psql -U admin --password -d polyledger_production # Production
```

Start PostgreSQL

```
❯ sudo service postgresql start
```
