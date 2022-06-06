var add;

function insertCar() {
  var carBrand = document.getElementById('textBrand').value;
  var carModel = document.getElementById('textModel').value;
  var carPlate = document.getElementById('textPlate').value.toUpperCase();
  var carDescription = document.getElementById('textDescription').value;
  var carOwner = document.getElementById('selectOwner').value;

  if (add) {
    //Insert car
    fetch('/api/v2/cars/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': cookieToken,
      },
      body: JSON.stringify({
        brand: carBrand,
        model: carModel,
        plate: carPlate,
        description: carDescription,
        owner: carOwner,
      }),
    })
      .then((resp) => {
        redirect('/cars.html');
        return;
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  } else {
    //Update car
    fetch('/api/v2/cars/' + getID(), {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': cookieToken,
      },
      body: JSON.stringify({
        brand: carBrand,
        model: carModel,
        plate: carPlate,
        description: carDescription,
        owner: carOwner,
      }),
    })
      .then((data) => {
        redirect('/cars.html');
      })
      .catch((error) => console.error(error));
  }
}

function populateSelectOwner(owner) {
  //Populate owner select box
  fetch('/api/v2/customers/', {
    headers: {
      'x-access-token': cookieToken,
    },
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((customers) => {
      return customers.map((customer) => {
        var id = customer.self.substring(customer.self.lastIndexOf('/') + 1);

        console.log(owner);

        if (owner && id == owner._id)
          $('#selectOwner').append(
            '<option selected="selected" value="' +
              id +
              '">' +
              customer.name +
              ' ' +
              customer.surname +
              '</option>'
          );
        else
          $('#selectOwner').append(
            '<option value="' +
              id +
              '">' +
              customer.name +
              ' ' +
              customer.surname +
              '</option>'
          );
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

$(document).ready(function () {
  //Init page
  if (getID() != null) {
    add = false;
    
    $('#title').text("Modifica auto");
    $('#actionClient').text('Salva modifiche');

    fetch('/api/v2/cars/' + getID(), {
      headers: {
        'x-access-token': cookieToken,
      },
    })
      .then((resp) => resp.json()) // Transform the data into json
      .then((data) => {
        $('#textPlate').val(data.plate);
        $('#textBrand').val(data.brand);
        $('#textModel').val(data.model);
        $('#textDescription').val(data.description);
        console.log(data)
        populateSelectOwner(data.owner);
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here

    //carica i dati come value delle textbox
  } else {
    add = true;
    $('#title').text("Aggiungi auto");
    populateSelectOwner();
  }
});
