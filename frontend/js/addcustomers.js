var add = 1;

var customername, customersurname, customerphone;

function actionCustomer() {
  customername = document.getElementById('textname').value;
  customersurname = document.getElementById('textsurname').value;
  customerphone = document.getElementById('textphone').value;

  console.log(
    'Data: ' + customername + ', ' + customersurname + ', ' + customerphone
  );

  if (customername == '' || customersurname == '' || customerphone == '') {
    alert('Uno o più campi non sono stati compilati, modifiche non accettate');
    return;
  }

  if (customerphone.length != 10) {
    alert('Numero di telefono invalido');
    return;
  }

  if (add) {
    fetch('/api/v2/customers/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': cookieToken,
      },
      body: JSON.stringify({
        name: customername,
        surname: customersurname,
        phone: customerphone,
      }),
    })
      .then((resp) => {
        redirect('/customers.html');
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  } else {
    fetch('/api/v2/customers/' + getID(), {
      method: 'PUT',
      body: JSON.stringify({
        name: customername,
        surname: customersurname,
        phone: customerphone,
      }),
      headers: {
        'Content-type': 'application/json',
        'x-access-token': cookieToken,
      },
      mode: 'cors',
    })
      .then((data) => {
        redirect('/customers.html');
      })
      .catch((error) => console.error(error));
  }
}

$(document).ready(function () {
  if (getID() != null) {
    add = 0;

    $('#actionClient').text('Salva modifiche');

    fetch('/api/v2/customers/' + getID(), {
      headers: {
        'x-access-token': cookieToken,
      },
    })
      .then((resp) => resp.json()) // Transform the data into json
      .then((data) => {
        document.getElementById('textname').value = data.name;
        document.getElementById('textsurname').value = data.surname;
        document.getElementById('textphone').value = data.phone;
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here

    //carica i dati come value delle textbox
  }
});
