const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const operations = require('./operations');
const customers = require('./customers');


const port = 8080;

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
  apis: ['*.js'],
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

//use express as middleware to run the specific requests and make the code more flexible
app.use('/api/v1/operations', operations);
app.use('/api/v1/customers', customers);


//Default 404 handler - it needs to be before defined before routing to the api urls
app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Not found' });
});

//connection to the mongodb server
//start the server on the port 8080
mongoose
  .connect(
    'mongodb+srv://db_prova1:admin@cluster0.ijsod.mongodb.net/officina?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connesso al db');

    app.listen(port, function () {
      console.log('listening on port ' + port);
    });
  })
  .catch((err) => {
    console.log('Non connesso - ' + err);
  });

