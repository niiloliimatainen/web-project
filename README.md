# Web Project (Angular/Node.js)

## Table of contents

[TOC]

## Terms used in this README

- backend - RESTful API implemented with Node.js, Express and MongoDB
- frontend - Single-page application implemented with Angular

## Requirements

- [Node.js](https://nodejs.org/en/) atleast version `12.17.0`
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager) atleast version `7.14.0`
- [MongoDB](https://docs.mongodb.com/manual/installation/) atleast version `4.4.5`
- Backend must run on localhost in order for frontend to show any content.

## Getting started

1. Clone this repository to your own environment [repository](https://github.com/niiloliimatainen/web-project.git)
2. Open terminal in the root folder
3. Run `npm install`
4. Run `npm run install:client`
5. Run `npm run install:server`
6. Run `npm run dev`
7. Optional: initialize server with Postman collection (instructions are down below)
8. Open browser of your choice and navigate to `http://localhost:4200/`

## NPM Scripts

Run these from the root folder of this repository

- `install:client` > download and install all the necessary dependencies to frontend
- `install:server` > download and install all the necessary dependencies to backend
- `dev` > run backend and frontend concurrently
- `client` > run only frontend
- `server` > run only backend
- `test` > run unit tests for frontend

## Tests

### Unit tests

Angular unit tests are written with Jasmine and karma. Run tests from root folder with `npm run test` or from client folder with `ng test`

### Postman

Server folder holds test folder which have Postman collection and Postman environment inside. These can be used to test the backend and to initialize the app. Postman collection adds users, entities, and comments to the database. If you want to see how the app looks and works with content inside it, you should run this collection.

How to run it:

1. Download Postman from (https://www.postman.com/downloads/)
2. Navigate to `server\test\postman` and import two files, `Server init.postman_collection.json` and `Server init.postman_environment.json`
3. Set `Server init.postman_environment.json` as an active environment
4. Run the collection

## Documentation

More specific documentation can be found from the `docs` folder
