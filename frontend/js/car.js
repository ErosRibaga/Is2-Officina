$(document).ready(function () {
  loadCars();
});

function loadCars() {
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
  fetch('http://localhost:8080/api/v1/cars')
    .then((resp) => resp.json())
    .then((data) => {
      return data.map((car) => {
        var obj = {
          id: car.self,
          brand: car.brand,
          model: car.model,
          plate: car.plate,
          description: car.description,
          owner: car.owner,
        };

        var tblRow =
          "<tr class='clickable'><td>  <p hidden>" +
          obj.id.substring(obj.id.lastIndexOf('/') + 1) +
          '</p>' +
          obj.brand +
          '</td><td>' +
          obj.model +
          '</td><td>' +
          obj.plate +
          '</td></tr>' +
          obj.description +
          '</td></tr>' +
          obj.owner +
          '</td></tr>';
        $(tblRow).appendTo('#car-table tbody');

        $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}
