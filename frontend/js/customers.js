/*const express = require('express');
const app = express();*/

function loadCustomers(){

  fetch('http://localhost:8080/api/v1/customers/')
  .then((resp) => resp.json()) // Transform the data into json
  .then((data) => {
    return data.map((customer) => {
      var obj = {
        id: customer.self,
        nome: customer.nome,
        cognome: customer.cognome,
        telefono: customer.telefono,
      };

      var tblRow = "<tr class='clickable'><td>  <p hidden>" + obj.id.substring(obj.id.lastIndexOf('/')+1) + "</p>" + obj.nome + "</td><td>" + obj.cognome + "</td><td>" + obj.telefono + "</td></tr>";
      $(tblRow).appendTo("#customer-table tbody");

      $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine

    });
  })
  .catch((error) => console.error(error)); // If there is any error you will catch them here
}



var selecteditemid = -1 ;

$(document).ready(function(){
  
  document.getElementById("addClient").onclick = function () {
    location.href = "/frontend/add-customer.html"; //add link to addPage
  };

  document.getElementById("remClient").onclick = function () {
    if(selecteditemid != -1){
      //chiamare api per la rimozione dal DB 

      fetch("http://localhost:8080/api/v1/customers/" + selecteditemid, {
        method: "DELETE",
      }).then(res => {
        console.log("Request complete! response:", res);
      })
      .catch(error => {
        console.log(error);
      });
      selecteditemid = -1;
    }
  };

  document.getElementById("modClient").onclick = function () {
    if(selecteditemid != -1){
      fetch("/frontend/mod-customer.html", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(selecteditemid)
      }).then(res => {
        console.log("Request complete! response:", res);
      });
    }
  };

  loadCustomers();

});

$(document).on('click','.clickable',function() {
  var elem = $(this);

  $(".selected").removeClass("selected");
  elem.addClass("selected");

  var splitted = elem.html().split('<');
  selecteditemid = splitted[2].substring(splitted[2].indexOf('>')+1)

  console.log(selecteditemid);

  //selecteditem.id = splitted[1].indexOf('<');
  //console.log(splitted[1].substr(0, splitted[1].indexOf('<')));
  //non la migliore delle soluzioni ma finchè visualizziamo l'id in questo modo è OK
  //da fixare appena integro il prendere l'id con API
});