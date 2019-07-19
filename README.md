# NC-NEWC-MC API

This project was built while studying at Northcoders to practice and test my skills in Node.js, PostgreSQL, Knex.js and building RESTful APIs.

### Prerequisites
You will require Node.js for this project.

### Installing

Fork your own copy of this repository

Navigate to the folder where you want to store it though the terminal and paste the following command in the terminal:

```
git clone <GitHub repo link>
```

cd into the repository

Run the following command in your terminal to install all the node modulules

```
npm install
```

### Database setup

You will need to create a config file called knexfile.js in your root directory. This may include sesitive details and you may want to .gitignore this file if these are included. The config file should look like this:

```
const { DB_URL } = process.env
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  migrations: {
    directory: "./db/data/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: 'username',
      password: 'password'
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: 'username',
      password: 'password'
    },
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```
**The password and username fields are optional for linux users only - not required if you are using a mac**

To set up and seed the database you can use these scripts which you'll find in the package.json file:

* npm run setup-dbs
* npm run migrate-latest
* npm run migrate-rollback
* npm run seed

### Testing

There are two test files in this project:

app.spec.js located in the spec folder, tests all the api endpoints to make sure they are working as desired, including error handling. Tests can be run by using:

* npm run test

utils.spec.js located in the db/utils folder which tests the utility functions that were used to manipulate data when seeding the database. These can be tested by running:

* npm run test-utils

### Routes

For all available endpoints view the endpoints.json file or access it on /api here - https://nc-news-mc.herokuapp.com/api

### Deployment

You can also create you own live version and deploy it on Heroku, instructions how to do so can be found here https://devcenter.heroku.com/articles/git

### Useful docs

* Node.js - https://nodejs.org/en/docs/
* Express - https://expressjs.com/
* Knex - https://knexjs.org/
* PostgreSQL - https://node-postgres.com/
* Heroku - https://devcenter.heroku.com/articles/getting-started-with-nodejs

### Author

**Mark Cooke**

### Acknowledgements

**Northcoders**
