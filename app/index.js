const mongoose = require('mongoose');
const express = require('express');
const app = require('./app.js');

const port = 8080;


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

