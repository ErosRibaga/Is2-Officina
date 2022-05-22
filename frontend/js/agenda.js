function loadOperations() {

  const curMonth = new Date().getMonth() + 1;
  var operations = [];

  fetch('http://localhost:8080/api/v1/operations/')
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

function addOperation(start, end, title) {

  console.log(start);

  fetch('http://localhost:8080/api/v1/operations/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      startDate: new Date(start),
      endDate: new Date(end),
    }),
  })
    .then((resp) => {
      calendar.addEvent({ title: title, start: start, end: end });
      console.log(resp);
      return;
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function openForm(start, end) {
  //Add one day to the selected date, because the calendar selection set the start the day before the selected one
  start = new Date(start);
  start.setDate(start.getDate() + 1);

  //Set the form datepickers values as the selected ones
  document.getElementById('startDate').valueAsDate = new Date(start);
  document.getElementById('endDate').valueAsDate = new Date(end);
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
    console.log(form)

    $.ajax({
      type: 'POST',
      url: actionUrl,
      data: form.serialize(), // serializes the form's elements.
      success: function (data) { //wait for the response
        loadOperations();
        closeForm();
      },
    });
  });
});
