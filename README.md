# Polyledger

> Automated cryptocurrency portfolio platform

This Django project serves multiple purposes. First, the account application allows clients to invest and view their account balance. Second, the custodian application processes pricing data and executes trades.

## Table of Contents

1. [Development](#development)
    - [Account app](#account-app)
        - [Funding a test account](#funding-a-test-account)
    - [Custodian app](#custodian-app)

## Development

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

The application should now be running at http://localhost:8080/account/login

#### Funding a test account

We use several integrations to allow test account funding without real money. We use [Plaid](https://plaid.com/) to verify and link bank accounts, [Stripe](https://stripe.com/) for ACH transfers, and [ngrok](https://ngrok.com) for a secure tunnel to localhost to listen to the Stripe ACH pending/success/fail webhook. These services are all set up; you will only need the API credentials.

To get started, download ngrok for macOS. Unzip it to your Applications directory

```
(venv) ❯ unzip /path/to/ngrok
(venv) ❯ mv /path/to/ngrok /Applications
```

Create a symlink to ngrok

```
(venv) ❯ cd /usr/loca/bin
ln -s /Applications/ngrok ngrok
```

Now you can run the `ngrok` command from any directory while in the terminal. Before starting ngrok, ensure that you are added to the Polyledger ngrok account. Then start ngrok in a new tab

```
ngrok http -subdomain=polyledger 8080
```

Assuming you have already added the Plaid and Stripe API credentials to your bash profile, you should be able to fund your account. In test mode, you can only fund your account with $100.

### Custodian app

To pull prices during development, start redis in a separate tab with `redis-server` and start the worker

```
(venv) ❯ celery -A custodian.tasks worker --loglevel=info
```
