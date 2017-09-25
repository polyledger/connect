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

Run the migrations

```
(venv) ❯ python manage.py migrate
```

Start the web application

```
(venv) ❯ python manage.py runserver 8080
```
