//Get id parameter from url
function getID() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
}

//
function redirect(url) {
  window.location.href = url;
}

function createSideBar(activeId) {
  var sidebar = `
    <a href="#home"><i class="fa-solid fa-house"></i>Home</a>
    <a id="sideAgenda" href="/frontend/agenda.html"><i class="fa-solid fa-calendar"></i>Agenda</a>
    <a id="sideCostumers" href="/frontend/customers.html"><i class="fa-solid fa-user"></i>Customers</a>
    <a href="#about"><i class="fa-solid fa-car"></i>Cars</a>
    <a href="#about"><i class="fa-solid fa-list"></i>Users</a>`;

  $('.sidebar').html(sidebar);
  $(activeId).addClass("active");
}


