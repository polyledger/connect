# Polyledger

> Automated cryptocurrency portfolio platform

This Django project serves multiple purposes. First, the account application allows clients to invest and view their account balance. Second, the lattice application serves as an analytic tool for the Polyledger team to manage the fund's portfolio.

## Development

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
