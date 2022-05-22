const mongoose = require('mongoose');
const express = require('express');
const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const operations = require('./operations');

const port = 8080;

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "API Officina",
      description: "Informazioni API Officina",
      contact: {
        name: "Eros Ribaga"
      },
      servers: ["http://127.0.0.1:8080"]
    }
  },
  // ['.routes/*.js']
  apis: ["*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


//Set the parser in order to access the body request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Default 404 handler - it needs to be before defined before routing to the api urls
app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Not found' });
});

//use express as middleware to run the specific requests and make the code more flexible
app.use('/api/v1/operations', operations);

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
