const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');

const operations = require('./operations');
const customers = require('./customers');
const cars = require('./cars');
const users = require('./users');


// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '2.0.0',
      title: 'API Officina',
      description: 'Informazioni API Officina',
      contact: {
        name: 'Eros Ribaga',
      },
    },
  },
  // ['.routes/*.js']
  apis: ['app/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocs));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Abilitate cors
app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//Set the parser in order to access the body request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/**
 * Authentication routing and middleware
 */
app.use('/api/v1/authentication', authentication);

// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
app.use('/api/v1/operations', tokenChecker);
app.use('/api/v1/customers', tokenChecker);
app.use('/api/v1/cars', tokenChecker);
app.use('/api/v1/users', tokenChecker);


//use express as middleware to run the specific requests and make the code more flexible
app.use('/api/v1/operations', operations);
app.use('/api/v1/customers', customers);
app.use('/api/v1/cars', cars);
app.use('/api/v1/users', users);

//Default 404 handler 
app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Not found' });
});

module.exports = app;