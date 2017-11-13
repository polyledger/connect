![Polyledger](/polyledger/static/polyledger/img/logo.png?raw=true "Polyledger")

> Automated cryptocurrency portfolio platform

This Django project serves multiple purposes. First, the account application allows clients to invest and view their account balance. Second, the custodian application processes pricing data and executes trades. Lastly, the admin app serves as an internal management tool.

## Table of Contents

1. [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Account app](#account-app)
        - [Funding a test account](#funding-a-test-account)
    - [Admin app](#admin-app)
    - [Custodian app](#custodian-app)
2. [Deployment](#deployment)
3. [Staging](#staging)
    - [Database](#database)

## Development

### Prerequisites

Before continuing, ensure you have Python 3.6 installed on your system (`python3 --version`).

Ensure that you've generated an SSH key on your MacBook. If you haven't generated one before, follow this [guide](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

Then copy the content of your public key (`id_rsa.pub`)

```
❯ cat ~/.ssh/id_rsa.pub
```

In your GitHub account go to [Settings > SSH and GPG Keys](https://github.com/settings/keys) and add it.

### Account app

Clone the repository to your home folder

```
❯ cd ~ && git clone https://github.com/polyledger/polyledger.git
```

Create a virtual environment and activate it (you could create this inside a `/polyledger` directory)

```
❯ virtualenv venv
New python executable in /Users/home/venv/bin/python
Installing setuptools, pip, wheel...done.
❯ source venv/bin/activate
```

Change into the repository folder

```
(venv) ❯ cd polyledger
```

Install requirements

```
(venv) ❯ pip install -r requirements.txt
```

Set up the envioronment variables (this step may vary depending on your system configuration)

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

#### Funding a test account

We use several integrations to allow test account funding without real money. We use [Plaid](https://plaid.com/) to verify and link bank accounts, [Stripe](https://stripe.com/) for ACH transfers, and [ngrok](https://ngrok.com) for a secure tunnel to localhost to listen to the Stripe ACH pending/success/fail webhook. These services are all set up; you will only need the API credentials.

To get started, download ngrok for macOS. Unzip it to your Applications directory

```
❯ unzip /path/to/ngrok
❯ mv /path/to/ngrok /Applications
```

Create a symlink to ngrok

```
❯ cd /usr/loca/bin
❯ ln -s /Applications/ngrok ngrok
```

Now you can run the `ngrok` command from any directory while in the terminal. Before starting ngrok, ensure that you are added to the Polyledger ngrok account. Then start ngrok in a new tab

```
❯ ngrok http -subdomain=polyledger 8080
```

Assuming you have already added the Plaid and Stripe API credentials to your bash profile, you should be able to fund your account. In test mode, you can only fund your account with $100.

### Admin app

The admin app allows Polyledger admins to use an admin interface for managing content on the site. If the web server is already running, you can log in at http://localhost:8080/admin/.

### Custodian app

To allow the deposit process to complete and execute trades, start redis in a separate tab with `redis-server` and start the worker

```
(venv) ❯ celery -E -A polyledger worker --loglevel=info -B
```

Alternatively, you can use the shell script to start both redis and the worker

```
(venv) ❯ ./start.sh worker
```

## Deployment

The app will be hosted on a [Digital Ocean droplet](https://cloud.digitalocean.com) staging environment. To access the droplet, you must have SSH key access.

```
❯ ssh root@192.241.220.209
```

The app is located in `/home/polyledger`. To update from the master branch, run a git pull:

```
❯ git pull origin master
```

Then reload gunicorn

```
❯ /home/venv/bin/gunicorn --bind 127.0.0.1:8001 --reload polyledger.wsgi
```

Keep in mind that the celery task is being supervised with [supervisor](http://supervisord.org/) and the config file is located at `/etc/supervisor/conf.d/celery.conf`. Here are basic supervisor commands

```
❯ sudo supervisorctl status celery
celery                            RUNNING    pid 18020, uptime 0:00:50
❯ sudo supervisorctl stop celery
celery: stopped
❯ sudo supervisorctl start celery
celery: started
❯ sudo supervisorctl restart celery
celery: stopped
celery: started
```

## Staging

### Database

Log into the PostgreSQL database

```
❯ psql -U admin --password -d polyledger_staging
```
