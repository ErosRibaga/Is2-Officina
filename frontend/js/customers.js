/*const express = require('express');
const app = express();*/


$(document).ready(function(){
    /*app.get('/customers', function(req, res){
        customerData = JSON.parse(res);
        //res.send('Hello World!');
    });*/

    var items = [];

    $.getJSON( "./example.json", function(data) {
        $.each(data, function(i, f) {
          var tblRow = "<tr><td>" + f.id + "</td><td>" + f.nome + "</td><td>" + f.cognome + "</td><td>" + f.codiceFiscale + "</td></tr>";
          $(tblRow).appendTo("#customer-table tbody");
        });
      });
})
