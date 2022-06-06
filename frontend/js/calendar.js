var calendar;
var calendarEl;

//Setup calendar
document.addEventListener('DOMContentLoaded', function () {
  calendarEl = document.getElementById('calendar');

  if (calendarEl == null) calendarEl = document.getElementById('userCalendar');

  if (calendarEl == null || getCookie('admin') == 'false') {
    calendar = userCalendar();
  } else {
    $('#agendaDescription').text('Seleziona un data o un periodo per aggiungere un evento');
    calendar = calendar();
  }

  calendar.render();
});

function calendar() {
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: new Date(),
    displayEventTime: false,
    firstDay: 1, //set monday as the first day of the week
    height: 650,
    selectable: true,

    select: (info) => {
      //set the count of the hours to 0 in order to get the right selectionable cells
      var date = new Date();
      date.setHours(0, 0, 0, 0);

      if (new Date(info.start).getTime() >= date) {
        openForm(info.start, info.end);
        //addOperation(info.start, info.end, "Ripara carrozzeria");
      }
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
    },

    eventClick: function (info) {
      var id = info.event.extendedProps.self.substring(
        info.event.extendedProps.self.lastIndexOf('/') + 1
      );
      window.location.href = '/operation.html?id=' + id;
    },
  });

  return calendar;
}

function userCalendar() {
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: new Date(),
    displayEventTime: false,
    firstDay: 1, //set monday as the first day of the week
    height: 650,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
    },
  });

  return calendar;
}
