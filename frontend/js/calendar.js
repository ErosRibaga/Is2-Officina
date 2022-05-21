var calendar;

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: new Date(),
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

    eventDidMount: (info) => {
      var tooltip = new Tooltip(info.el, {
        title: info.event.extendedProps.description,
        placement: 'top',
        trigger: 'hover',
        container: 'body',
      });
    },

    eventClick: function (info) {
      console.log(info.event.extendedProps);
      alert(
        'Event: ' +
          info.event.title +
          '\nDescription: ' +
          info.event.extendedProps.description
      );
    },
  });

  calendar.render();
});
