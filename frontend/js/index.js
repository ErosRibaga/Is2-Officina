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

/*const express = require('express');
const app = express();*/

function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

var cookieToken = getCookie('token');
var isAdmin = getCookie('admin');

function createSideBar(activeId) {
  var sidebar;

  sidebar =
    '<a id="sideAgenda" href="/frontend/agenda.html"><i class="fa-solid fa-calendar"></i>Agenda</a>';

  if (isAdmin === 'true') {
    sidebar += `
    <a id="sideCustomers" href="/frontend/customers.html"><i class="fa-solid fa-user"></i>Customers</a>
    <a id="sideCars" href="/frontend/cars.html"><i class="fa-solid fa-car"></i>Cars</a>
    <a id="sideUsers" href="/frontend/users.html"><i class="fa-solid fa-list"></i>Users</a>`;
  }

  sidebar += '<hr>';
  sidebar +=
    '<a id="sideLogout" onClick="logout()" cursor="pointer"><i class="fa-solid fa-right-from-bracket"></i>Log out</a>';

  $('.sidebar').html(sidebar);
  $(activeId).addClass('active');
}

function logout() {
  fetch('http://localhost:8080/api/v1/authentication/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'admin=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/frontend/login.html';
    });
}

$(document).ready(function () {
  if ((!cookieToken || cookieToken == undefined) && window.location.pathname != '/frontend/login.html')
    redirect('/frontend/login.html');
});

document.addEventListener('DOMContentLoaded', () => {
  $('#sideLogout').css('cursor', 'pointer');
});
