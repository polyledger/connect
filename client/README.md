# Polyledger

> The frontend client for the Polyledger platform

## Table of Contents

1. [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
2. [Deployment](#deployment)

## Development

### Prerequisites

Before continuing, you should have [Node.js](https://nodejs.org/en/) (preferably > version 8) and [npm](https://www.npmjs.com/get-npm) installed on your system.

### Getting Started

Clone the repository to your home folder if you haven't already

```
❯ cd ~ && git clone https://github.com/polyledger/polyledger.git
```

Install dependencies

```
❯ cd ./polyledger/client
❯ npm install
```

Run the development server

```
❯ npm run dev
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

After pulling new changes from the master branch, ensure that any new dependencies are installed with `npm i`. Then run the following command to build for production

```
npm run build
```

---

[Back to Main](./README.md)
