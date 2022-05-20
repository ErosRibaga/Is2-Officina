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
      date.setHours(0,0,0,0)
      
      if (new Date(info.start).getTime() >= date) {
        openForm(info.start, info.end);
        //addOperation(info.start, info.end, "Ripara carrozzeria");
      }
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
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
    eventMouseEnter: (info) => {
      info.el.style.backgroundColor = 'red';
      info.el.style.borderColor = 'red';
      info.el.style.cursor = 'pointer';
    },
    eventMouseLeave: (info) => {
      info.el.style.backgroundColor = '#3788d8';
      info.el.style.borderColor = '#3788d8';
    },
  });

  calendar.render();
});
