# Polyledger

> AI-based cryptocurrency hedge fund

This Django project serves multiple purposes. First, the account application allows clients to invest and view their account balance. Second, the lattice application serves as an analytic tool for the Polyledger team to manage the fund's portfolio.

## Development

Clone the repository to your home folder

```
❯ cd ~ && git clone https://github.com/polyledger/polyledger.git
```

Change into the repository folder

```
❯ cd polyledger
```

Start the virtual environment

```
❯ source venv/bin/activate
```

Install requirements

```
(venv) ❯ pip install -r requirements.txt
```

Change into the project folder

```
(venv) ❯ cd polyledger
```

Set up the envioronment variables (this step may vary depending on your system configuration)

```
(venv) ❯ echo "
dquote> SECRET_KEY={A secret key goes here}
dquote> EMAIL_HOST_PASSWORD={The email host password goes here}
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
