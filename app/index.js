const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

const Operation = require('./models/operation');
const port = 8080;

const operations = require('./operations');

//Set the parser in order to access the body request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

//use express as middleware to run the specific requests and make the code more flexible
app.use('/api/v1/operations', operations);

//Default 404 handler
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
