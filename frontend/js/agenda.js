//Load the operations and populate the calendar
function loadOperations() {
  const curMonth = new Date().getMonth() + 1;
  var operations = [];

  fetch('http://localhost:8080/api/v1/operations/', {
    headers: {
      'x-access-token': cookieToken,
    },
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      return data.map((operation) => {
        var obj = {
          self: operation.self,
          title: operation.title,
          description: operation.description,
          start: operation.startDate,
          end: operation.endDate,
        };
        operations.push(obj);
      });
    })
    .then(() => {
      calendar.removeAllEvents();
      calendar.addEventSource(operations);
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

//Open the form to create a new operation
function openForm(start, end) {
  //Add one day to the selected date, because the calendar selection set the start the day before the selected one
  start = new Date(start);
  start.setDate(start.getDate() + 1);

  //Set the form datepickers values as the selected ones
  document.getElementById('startDate').valueAsDate = new Date(start);
  document.getElementById('endDate').valueAsDate = new Date(end);

  //Populate cars select box
  fetch('http://localhost:8080/api/v1/cars/', {
    headers: {
      'x-access-token': cookieToken,
    }
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      return data.map((car) => {
        //get car id
        var id = car.self.substring(car.self.lastIndexOf('/') + 1);

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

  //Populate employyes select box
  fetch('http://localhost:8080/api/v1/users/', {
    headers: {
      'x-access-token': cookieToken
    }
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      return data.map((user) => {

        //get user id
        var id = user.self.substring(user.self.lastIndexOf('/') + 1);

        $('#employees').append(
          '<option value="' +
            id +
            '">' +
            user.name +
            ' ' +
            user.surname +
            '</option>'
        );
      });
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here

  $('#popupForm').css('display', 'block');
}

function closeForm() {
  $('#popupForm').css('display', 'none');
}

// wait for the DOM to be loaded
$(document).ready(function () {
  loadOperations();

  $('#opForm').submit(function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var form = $(this);
    var actionUrl = form.attr('action');

    $.ajax({
      type: 'POST',
      url: actionUrl,
      headers: {
        'x-access-token': cookieToken,
      },
      data: form.serialize(), // serializes the form's elements.
      success: function (data) {
        console.log(data);
        //wait for the response
        loadOperations();
        closeForm();
      },
    });
  });
});
