<p align="center">
  <img src="/client/src/assets/logo.png?raw=true" height="100">
</p>

> Automated cryptocurrency portfolio platform

![Screenshot](/demo.png?raw=true)

---

## Prerequisites

You must have [Docker](https://www.docker.com/community-edition) installed on your system. Then clone this repository:

```
❯ git clone https://github.com/polyledger/polyledger.git
```

You must also install client dependencies before running the application in Docker.

```
❯ cd polyledger/client && npm i
```

To install the private packages, you have to export an NPM token as an environment variable. That token should look like `NPM_TOKEN=00000000-0000-0000-0000-000000000000`. Export it in your shell. Now you can build the client container with the private packages:

```
❯ docker build --build-arg NPM_TOKEN=${NPM_TOKEN} .
```

## Development

Start the development services:

```
❯ docker-compose up
```

---

## Production

Start the production services:

```
❯ docker-compose -f production.yml up
```
