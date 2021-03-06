const mongoose = require('mongoose');
const express = require('express');
const app = require('./app/app.js');

const port = process.env.PORT || 8080

//connection to the mongodb server
//start the server on the port 8080
mongoose
  .connect(
    process.env.DB_URL
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

