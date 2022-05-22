function displayOperation(data) {
  console.log(data);

  $('#title').text(data.title);
  $('#description').text(data.description);

  $('#startDate').text(new Date(data.startDate).toDateString());
  $('#endDate').text(new Date(data.endDate).toDateString());

  $('#brand').append(data.car);
  $('#model').append('modello');

  $('#cName').append(data.customer);
  $('#cSurname').append('cognome');
  $('#cNumber').append('telefono');

  $('#eName').append(data.employee);
  $('#eSurname').append('cognome');
}

$(document).ready(function () {
  fetch('http://localhost:8080/api/v1/operations/' + getID())
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      displayOperation(data);
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
});
