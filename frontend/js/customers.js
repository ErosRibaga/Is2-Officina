/*const express = require('express');
const app = express();*/


$(document).ready(function(){

    /*fetch('../api/v1/customers')
    .then((resp) => resp.json())
    .then(function(data){
      console.log(data);
      //loggedUser.token = data.token;
      //loggedUser.email = data.email;
      //loggedUser.id = data.id;
      //loggedUser.self = data.self;
    })
    .catch(error => console.error(error));*/

    $.getJSON( "./example.json", function(data) {
        $.each(data, function(i, f) {
          var tblRow = "<tr><td>" + f.id + "</td><td>" + f.nome + "</td><td>" + f.cognome + "</td><td>" + f.codiceFiscale + "</td></tr>";
          $(tblRow).appendTo("#customer-table tbody");
        });

        $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });

})
