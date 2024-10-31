<div align="center">
	<h1>Recipe book web app</h1>
</div>

## Description

  This is a recipe web application, where users can upload, edit and save recipes. In addition, it offers additional functions such as converting between units and adjusting ingredient quantities.

## Features

<ul style="display: flex; flex-direction: column; gap: 5px">
	<li>User registration.</li>
	<li>Login and session management.</li>
	<li>Upload and edit recipes.</li>
	<li>Save recipes from other users.</li>
  <li>Quantities calculator.</li>
</ul>

## Tech stack

<ul style="display: flex; flex-direction: column; gap: 5px">
  <li>Typescript.</li>
	<li>Backend: Node with Express.</li>
	<li>Frontend: React, React Router.</li>
</ul>

## Installation

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
  npm install
  ```
4. Navigate to the server directory, create a .env file and write the following:
  ```dotenv
  NODE_ENV=development
  # The desired port
  PORT=3000
  # The secret key to encrypt the session tokens
  SECRET_JWT_KEY=write-here-your-ultra-secret-key-too-big
  ```
5. Once in the server directory, build and start the server:
  ```bash
  npm run build && npm run start
  ```

View the website at: http://localhost:PORT

## Database options

  This project can use either a local database or a more scalable option like MongoDB or MySQL.

### Local database

  > [!WARNING]
  > Not recommended.

  For the local database, the project uses the lowdb library, which stores data in a JSON file. There is a class called LowDB in server/src/helpers from which you can instantiate an object that facilitates queries to the database that includes methods such as addOne, findOne, removeOne, etc., to manage the data.

### Non-local database

  To use a non-local database such as MongoDB or MySQL, create a model similar to the local database model to avoid changing the controller and other parts of the application. For better integration, types are provided in server/src/types (see recipes.ts and users.ts).