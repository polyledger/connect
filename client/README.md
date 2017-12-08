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

After pulling new changes from the master branch, ensure that any new dependencies are installed. Then run the following command to build for production and view the bundle analyzer report

```
npm run build --report
```
