var selecteditemid;

function loadCars() {
  fetch('http://localhost:8080/api/v1/cars', {
    headers: {
      'x-access-token': cookieToken,
    },
  })
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
          obj.plate +
          '</td><td>' +
          obj.brand +
          '</td><td>' +
          obj.model +
          '</td><td>' +
          obj.description +
          '</td><td>' +
          obj.owner.name +
          ' ' +
          obj.owner.surname +
          '</td></tr>';
        $(tblRow).appendTo('#car-table tbody');

        $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function changeLocation() {
  if (selecteditemid != undefined) {
    window.location.href =
      '/frontend/add-car.html?id=' + selecteditemid;
  } else {
    alert('Prima seleziona un cliente');
  }
}

function deleteCar() {
  if (selecteditemid != undefined) {
    fetch('http://localhost:8080/api/v1/cars/' + selecteditemid, {
      method: 'DELETE',
      headers: {
        'x-access-token': cookieToken,
      },
    })
      .then((res) => {
        console.log('Request complete! response:', res);
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    selecteditemid = -1;
  } else {
    alert('Prima seleziona un cliente');
  }
}

$(document).on('click', '.clickable', function () {
  var elem = $(this);

  $('.selected').removeClass('selected');
  elem.addClass('selected');

  var splitted = elem.html().split('<');
  selecteditemid = splitted[2].substring(splitted[2].indexOf('>') + 1);
});

$(document).ready(function () {
  loadCars();
});
