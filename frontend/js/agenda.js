function loadOperations() {
  //const ul = document.getElementById('operations'); // Get the list where we will place our authors

  //ul.textContent = '';

  const curMonth = new Date().getMonth() + 1;
  var operations = [];

  fetch('http://localhost:8080/api/v1/operations/')
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      return data.map((operation) => {
        var obj = {
          title: operation.title,
          description: operation.description,
          start: operation.startDate,
          end: operation.endDate,
        };
        console.log(operation.description);
        operations.push(obj);
      });
    })
    .then(() => {
      calendar.addEventSource(operations);
      //calendar.addEvent({ start: '2019-04-23' })
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

loadOperations();

function openForm(start, end) {

  calendar.selectable = false;
  
  document.getElementById('startDate').valueAsDate = new Date(start);
  document.getElementById('endDate').valueAsDate = new Date(end);
  document.getElementById('popupForm').style.display = 'block';
}
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
}
