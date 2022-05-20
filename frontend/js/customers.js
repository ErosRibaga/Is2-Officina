/*const express = require('express');
const app = express();*/

var selecteditem;

$(document).ready(function(){

  fetch('http://localhost:8080/api/v1/operations/')
  .then((resp) => resp.json()) // Transform the data into json
  .then((data) => {
    return data.map((operation) => {
      var obj = {
        title: operation.title,
        self: operation.self,
        employee: operation.employee,
        car: operation.car,
      };
      //console.log(operation);
    });
  })
  .catch((error) => console.error(error)); // If there is any error you will catch them here

    $.getJSON( "./example.json", function(data) {
        $.each(data, function(i, f) {
          var tblRow = "<tr class='clickable'><td>" + f.id + "</td><td>" + f.nome + "</td><td>" + f.cognome + "</td><td>" + f.codiceFiscale + "</td></tr>";
          $(tblRow).appendTo("#customer-table tbody");
        });

        $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });

});

$(document).on('click','.clickable',function() {
  selecteditem = $(this).html();
  var splitted = selecteditem.split('<td>');
  console.log(splitted[1].substr(0, splitted[1].indexOf('<')));
});