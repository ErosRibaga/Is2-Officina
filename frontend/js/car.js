var selecteditemid;

function loadCars() {
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
          '</td><td>' +
          obj.description +
          '</td><td>' +
          obj.owner +
          '</td></tr>';
        $(tblRow).appendTo('#car-table tbody');

        $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function updateRedirect() {
  window.location.href = '/frontend/operation.html';
}

$(document).on('click', '.clickable', function () {
  var elem = $(this);

  $('.selected').removeClass('selected');
  elem.addClass('selected');

  var splitted = elem.html().split('<');
  selecteditemid = splitted[2].substring(splitted[2].indexOf('>') + 1);

  console.log(selecteditemid);

  //selecteditem.id = splitted[1].indexOf('<');
  //console.log(splitted[1].substr(0, splitted[1].indexOf('<')));
  //non la migliore delle soluzioni ma finchè visualizziamo l'id in questo modo è OK
  //da fixare appena integro il prendere l'id con API
});

$(document).ready(function () {
  loadCars();
});
