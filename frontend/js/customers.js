/*const express = require('express');
const app = express();*/

var selecteditem = { id: -1 };

$(document).ready(function(){
  
  document.getElementById("addClient").onclick = function () {
    location.href = "/frontend/add-customer.html"; //add link to addPage
  };

  document.getElementById("remClient").onclick = function () {
    if(selecteditem != -1){
      //chiamare api per la rimozione dal DB 
      selecteditem = -1;
    }
  };

  document.getElementById("modClient").onclick = function () {
    if(selecteditem != -1){
      fetch("/frontend/mod-customer.html", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(selecteditem)
      }).then(res => {
        console.log("Request complete! response:", res);
      });
    }
  };

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
  var splitted = $(this).html().split('<td>');
  selecteditem.id = splitted[1].indexOf('<');
  console.log(splitted[1].substr(0, splitted[1].indexOf('<')));
  //non la migliore delle soluzioni ma finchè visualizziamo l'id in questo modo è OK
});