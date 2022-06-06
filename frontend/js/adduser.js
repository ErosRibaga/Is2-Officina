function createUser() {
  var name = document.getElementById('textNome').value;
  var surname = document.getElementById('textCognome').value;
  var email = document.getElementById('textMail').value;
  var password = document.getElementById('textPassword').value;
  var role = document.getElementById('textRoles').value == 'admin';

  fetch('/api/v2/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': cookieToken,
    },
    body: JSON.stringify({
      name: name,
      surname: surname,
      email: email,
      password: password,
      admin: role,
    }),
  })
    .then((resp) => {
      redirect('/users.html');
    })
    .catch((error) => console.error(error));
}

function updateUser() {
  var name = $('#textNome').val();
  var surname = $('#textCognome').val();
  var email = $('#textMail').val();
  var password = $('#textPassword').val();
  var role = $('#textRoles').val() == 'admin';

  fetch('/api/v2/users/' + getID(), {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': cookieToken,
    },
    body: JSON.stringify({
      name: name,
      surname: surname,
      email: email,
      password: password,
      admin: role,
    }),
  })
    .then((data) => {
      redirect('/users.html');
    })
    .catch((error) => console.error(error));
}

$(document).ready(function () {
  //Init page
  if (getID() != null) {
    //if the url has no id in the parameters it means the page is needed to add a new user
    $('#saveUser').click(updateUser);

    $('#title').text('Modifica utente');
    $('#actionClient').text('Salva modifiche');

    fetch('/api/v2/users/' + getID(), {
      headers: {
        'x-access-token': cookieToken,
      },
    })
      .then((resp) => resp.json()) // Transform the data into json
      .then((data) => {
        $('#textNome').val(data.name);
        $('#textCognome').val(data.surname);
        $('#textMail').val(data.email);
        $('#textPassword').val(data.password);

        if (data.admin) $('#selAdmin').attr('selected', true);
        else $('#selDipendente').attr('selected', true);
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here

    //carica i dati come value delle textbox
  } else {
    $('#saveUser').click(createUser);
    $('#title').text('Aggiungi utente');
  }
});
