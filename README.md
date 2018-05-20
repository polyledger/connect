<p align="center">
  <img src="/web_client/src/assets/logo.png?raw=true" height="100">
</p>

![Screenshot](/polyledger.png?raw=true)

> Cryptoasset portfolio management platform

---

## Prerequisites

You must have [Docker](https://www.docker.com/community-edition) installed on your system. Then clone this repository:

```
❯ git clone https://github.com/polyledger/polyledger.git
```

You must also install web dependencies before running the application in Docker. To install the private packages, you have to export `NPM_TOKEN` as an environment variable. Export it in your shell. Now install on the dependencies locally:

```
❯ cd ./polyledger/web_client && npm install
```

You will need a file containing your environment variables (either `.env.development` or `.env.production`) at the project root. The contents should contain these variables:

```
NPM_TOKEN=<npm_token>
SECRET_KEY=<secret_key>
PYTHON_ENV=<development|production>
EMAIL_HOST_PASSWORD=<email_host_password>
DJANGO_SETTINGS_MODULE=polyledger.settings.<local|production>
BITBUTTER_API_KEY=<bitbutter_api_key>
BITBUTTER_API_SECRET=<bitbutter_api_secret>
BITBUTTER_BASE_URI=<bitbutter_base_uri>
BITBUTTER_PARTNERSHIP_ID=<bitbutter_partnership_id>
BITBUTTER_PARTNER_ID=<bitbutter_partner_id>
```

Now you can build the Docker containers:

```
❯ cd .. && docker-compose build --build-arg NPM_TOKEN=${NPM_TOKEN}
```

## Development

Start the development services:

```
❯ docker-compose up
```

If you have fresh volumes and containers, you can pre-populate the database. Just copy this container id:

```
❯ docker-compose ps -q web_client
```

And now load the data:

```
❯ docker exec -it <container_id> python manage.py loaddata initial_data.json --app api
```

---

## Production

Start the production services:

```
❯ docker-compose -f production.yml up
```
