## Description

This repository is for order test api.

## How to use

#### Requirements
 - Node: 10.16+ version
 - NestJs: 6+
 - npm: 6.10+ version
 - Angular: 8+
 - Typescript: 3.4+
 - MongoDb: 2.6+

Make sure you have cloned the following two microservices:
  - Order API - [Github Link](https://github.com/pravindot17/ordertest)
  - Payment API - [Github Link](https://github.com/pravindot17/paytest)

Also make sure you have the following Order Panel ui:
- Order Panel - [Github Link](https://github.com/pravindot17/order-panel)

#### Ports Used
- Order API: 3001
- Payment API: 3002
- Order Panel(UI): 4200

> Important Note: Before running **Payment API service** you must export the environment variable, AUTH in the terminal. Use following code as it is:
```
$ export AUTH=MY_TOP_SECRET_AUTH_STRING
$ npm run start:dev
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## About me
Hello folks, I am passionate about coding, designing architecture and learning new things. To know more about me you can use the following links.
 - [LinkedIn](https://www.linkedin.com/in/pravin-lolage)
 - [Medium](https://medium.com/@pravindot17)
 - [StackOverflow](https://stackoverflow.com/story/pravindot17)
 - [Github](https://github.com/pravindot17)
 - [Instagram](https://www.instagram.com/_naturalclicks/) (Bit addicted to photography ;) )