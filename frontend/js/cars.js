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
          var tblRow = "<tr><td>" + f.brand + "</td><td>" + f.model + "</td><td>" + f.plate + "</td><td>" + f.description + "</td></tr>" + f.owner + "</td></tr>";
          $(tblRow).appendTo("#car-table tbody");
        });

        $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });

})

//da mettere in cartella app
/**router.post('', async (req, res) => {

	let car = new Car({
        targa: req.body.targa,
        modello: req.body.modello,
        anno: req.body.anno,
        proprietario:req.body.proprietario
    });
    
	car = await car.save();
    
    let carId = car.id;

    console.log('car saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */ /**
    res.location("/api/v1/car/" + carId).status(201).send();
});  */ 