//Init the operation or the update-operation pages
function initOperation(type) {
  fetch('http://localhost:8080/api/v1/operations/' + getID(), {
    headers: {
      'x-access-token': cookieToken,
    },
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      if (type == 'get') displayOperation(data);
      else if (type == 'update') initUpdateOperation(data); //populate update-operation.html
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

//Print the information about the operation in the operation.html
function displayOperation(data) {
  $('#title').text(data.title);
  $('#description').text(data.description);

  $('#startDate').text(new Date(data.startDate).toDateString());
  $('#endDate').text(new Date(data.endDate).toDateString());

  $('#cName').append(data.customer);
  $('#cSurname').append('cognome');
  $('#cNumber').append('telefono');

  $('#eName').append(data.employee);
  $('#eSurname').append('cognome');

  //get car info
  fetch('http://localhost:8080/api/v1/cars/' + data.car, {
    headers: {
      'x-access-token': cookieToken,
    },
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((car) => {
      $('#brand').append(car.brand);
      $('#model').append(car.model);
      $('#plate').append(car.plate);
    });
}

//Insert the old values inside the form inputs of the update-operation.html
function initUpdateOperation(dataOp) {
  $('#title').val(dataOp.title);
  $('#description').val(dataOp.description);

  var start = new Date(dataOp.startDate).toISOString().split('T')[0];
  var end = new Date(dataOp.endDate).toISOString().split('T')[0];
  var today = new Date().toISOString().split('T')[0];

  //Set startDate datapicker
  $('#startDate').val(start);
  $('#startDate').attr('min', today);
  $('#startDate').change(() => {
    $('#endDate').attr('min', $('#startDate').val());
  });

  //Set endDate datapicker
  $('#endDate').val(end);
  $('#endDate').attr('min', start);

  //Populate cars select box
  fetch('http://localhost:8080/api/v1/cars/')
    .then((resp) => resp.json()) // Transform the data into json
    .then((carData) => {
      return carData.map((car) => {
        console.log(car);
        //get car id
        var id = car.self.substring(car.self.lastIndexOf('/') + 1);

        if (id == dataOp.car)
          $('#cars').append(
            '<option selected="selected" value="' +
              id +
              '">' +
              car.brand +
              ' ' +
              car.model +
              '</option>'
          );
        else
          $('#cars').append(
            '<option value="' +
              id +
              '">' +
              car.brand +
              ' ' +
              car.model +
              '</option>'
          );
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function updateOperation() {
  var title = $('#title').val();
  var description = $('#description').val();

  var startDate = $('#startDate').val();
  var endDate = $('#endDate').val();

  var car = $('#cars').val();

  fetch('http://localhost:8080/api/v1/operations/' + getID(), {
    method: 'PUT',
    body: JSON.stringify({
      title: title,
      description: description,
      endDate: new Date(endDate),
      startDate: new Date(startDate),
      employee: 'Tiziano Ferro',
      car: car,
    }),
    headers: {
      'Content-type': 'application/json',
      'x-access-token': cookieToken,
    },
    mode: 'cors',
  })
    .then((data) => {
      console.log(data);
      redirect('/frontend/operation.html?id=' + getID());
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here

  /*
  var title = $('#eName').val();
  var title = $('#eSurname').val();*/
}

function deleteOperation() {
  fetch('http://localhost:8080/api/v1/operations/' + getID(), {
    method: 'DELETE',
    headers: {
      'x-access-token': cookieToken,
    },
  })
    .then((data) => {
      console.log(data);
      redirect('/frontend/agenda.html');
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}
