const mongoose = require('mongoose');
const express = require('express');
const app = express();

const Operation = require('./models/operation');
const port = 8080;

const operations = require('./operations');

//Set the parser in order to access the body request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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


