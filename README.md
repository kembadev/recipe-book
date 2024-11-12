# 📝Recipe book web app

## Description

This is a recipe book web application, where users can upload, edit and save recipes. It offers additional functions such as converting between units and adjusting ingredient quantities.

## Contents

- [Recipe book web app](#recipe-book-web-app)
  - [Description](#description)
  - [Contents](#contents)
  - [Requirements](#requirements)
    - [Node.js](#nodejs)
    - [pnpm](#pnpm)
  - [Features](#features)
  - [Tech stack](#tech-stack)
    - [Typescript](#typescript)
    - [Server](#server)
    - [Frontend](#frontend)
  - [Installation](#installation)
  - [Database options](#database-options)
    - [Local database](#local-database)
    - [Non local database](#non-local-database)

## Requirements

### Node.js

[Node.js](https://nodejs.org/en/) version 20.12 or newer.

### pnpm

[pnpm](https://pnpm.io/) is required for development purposes. pnpm workspaces are used. Most of scripts are defined with pnpm.

## ✨Features

<ul style="display: flex; flex-direction: column; gap: 5px">
	<li>User registration.</li>
	<li>Login and session management.</li>
	<li>Upload and edit recipes.</li>
	<li>Save recipes from other users.</li>
  <li>Quantities calculator.</li>
</ul>

## 💻Tech stack

### Typescript

Both server and client use [Typescript](https://www.typescriptlang.org/).

### Server

[Node.js](https://nodejs.org/en/) & [Express.js](https://expressjs.com/).

### Frontend

[React](https://react.dev/).

## 👩‍💻Installation

To install and run locally:

1. Clone the repository:
  ```bash
  git clone https://github.com/kembadev/recipe-book.git
  ```
2. Navigate to the project directory:
  ```bash
  cd recipe-book
  ```
3. Install the dependencies:
  ```bash
  # pnpm required for workspaces compatibility
  pnpm install
  ```
4. Navigate to the server directory:
  ```bash
  cd server
  ```
5. Once in the server directory, create a .env file and write the following:
  ```dotenv
  NODE_ENV=development
  # The desired port
  PORT=3000
  # The secret key to encrypt the session tokens
  SECRET_JWT_KEY=write-here-your-ultra-secret-key-too-big
  ```
6. Build and start the server:
  ```bash
  npm run build
  npm run start
  ```

View the website at: http://localhost:PORT

## 💾Database options

This project can use either a local database or a more scalable option like MongoDB or MySQL.

### Local database

> [!NOTE]
> Not recommended.

For the local database (file system), the project uses the lowdb library, which stores data in a JSON file. There is a class called LocalDB in server/src/helpers from which you can instantiate an object that facilitates queries to the database that includes methods such as addOne, findOne, removeOne, etc., to manage the data.

### Non-local database

To use a non-local database such as MongoDB or MySQL, create a model similar to the local database model to avoid changing the controller and other parts of the application. For better integration, types are provided in server/src/types.