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
    '<a id="sideHome" href="/index.html"><i class="fa-solid fa-home"></i>Home</a>';
  sidebar +=
    '<a id="sideAgenda" href="/agenda.html"><i class="fa-solid fa-calendar"></i>Agenda</a>';

  if (isAdmin === 'true') {
    sidebar += `
    <a id="sideCustomers" href="/customers.html"><i class="fa-solid fa-user"></i>Customers</a>
    <a id="sideCars" href="/cars.html"><i class="fa-solid fa-car"></i>Cars</a>
    <a id="sideUsers" href="/users.html"><i class="fa-solid fa-list"></i>Users</a>`;
  }

  sidebar += '<hr>';
  sidebar +=
    '<a id="sideLogout" onClick="logout()" cursor="pointer"><i class="fa-solid fa-right-from-bracket"></i>Log out</a>';

  $('.sidebar').html(sidebar);
  $(activeId).addClass('active');
}

function logout() {
  fetch('/api/v2/authentication/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'admin=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login.html';
    });
}

$(document).ready(function () {
  if ((!cookieToken || cookieToken == undefined) && window.location.pathname != '/login.html')
    redirect('/login.html');

  if(cookieToken && window.location.pathname == '/login.html')
    redirect('/agenda.html');

});

document.addEventListener('DOMContentLoaded', () => {
  $('#sideLogout').css('cursor', 'pointer');
});
