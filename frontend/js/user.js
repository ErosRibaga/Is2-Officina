var selecteditemid;

function loadUsers() {
  fetch('http://localhost:8080/api/v1/users', {
    headers: {
      'x-access-token': cookieToken,
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      return data.map((user) => {
        var obj = {
          id: user.self,
          name: user.name,
          surname: user.surname,
          email: user.email,
          admin: user.admin,
        };

        var check = '';
        if (obj.admin) {
          check = '<i class="py-0 fa-solid fa-check"></i>';
        } 

        var tblRow =
          "<tr class='clickable'><td><p hidden>" +
          obj.id.substring(obj.id.lastIndexOf('/') + 1) +
          '</p>' +
          obj.name +
          '</td><td>' +
          obj.surname +
          '</td><td>' +
          obj.email +
          '</td><td>' +
          check +
          '</td></tr>';
        $(tblRow).appendTo('#user-table tbody');

        //$('#user-count').html('<p>Numero di Utenti:' + data.length + '</p>'); //fare lo stesso con le macchine
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function changeLocation() {
  if (selecteditemid != undefined) {
    window.location.href = '/frontend/add-user.html?id=' + selecteditemid;
  } else {
    alert('Prima seleziona un utente');
  }
}

function seeOperations() {
  if (selecteditemid != -1) {
    window.location.href = '/frontend/user-operations.html?id=' + selecteditemid;
  } else {
    alert('No user selected');
  }
}

function deleteUser() {
  if (selecteditemid != undefined) {
    fetch('http://localhost:8080/api/v1/users/' + selecteditemid, {
      method: 'DELETE',
      headers: {
        'x-access-token': cookieToken,
      },
    })
      .then((res) => {
        //if response status code == 403
        if(res.status == 403) {
          $('#message').text("Impossibile eliminare l'utente, operazioni trovate");
        } else {          
          location.reload();
          console.log('Request complete! response:', res);
        }        
      })
      .catch((error) => {
        console.log(error);
      });
    selecteditemid = -1;
  } else {
    alert('Prima seleziona un utente');
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
  loadUsers();

  $('#userOperations').click(seeOperations);
});
