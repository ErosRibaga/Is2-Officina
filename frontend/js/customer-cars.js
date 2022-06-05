function loadCars() {
  fetch('http://localhost:8080/api/v1/users/' + getID() + '/cars', {
    headers: {
      'x-access-token': cookieToken,
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
        console.log(data)
      return data.map((car) => {
        var obj = {
          id: car._id,
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
          '</td></tr>';
        $(tblRow).appendTo('#car-table tbody');

        $('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

$(document).ready(function () {
  loadCars();
});
