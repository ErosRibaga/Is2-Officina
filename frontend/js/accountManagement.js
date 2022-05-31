var loggedUser = {};

function login(){

    var email = document.getElementById("textmail").value;
    var password = document.getElementById("textpassword").value;

    fetch('http://localhost:8080/api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        document.cookie = "token=" + data.token;
        document.cookie = "admin=" + data.admin;
        redirect('../frontend/customers.html');
        return;
    })
    .catch( error => console.error(error) );
}

function createUser(){
    
    var name = document.getElementById("textnome").value;
    var surname = document.getElementById("textcognome").value;
    var email = document.getElementById("textmail").value;
    var password = document.getElementById("textpassword").value;
    var role = document.getElementById("roles").value == "admin";


    fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            { 
                name : name,
                surname: surname,
                email: email, 
                password: password ,
                admin: role
            }),
    })
    .then((resp) => {
        redirect('/frontend/users.html');
    })
    .catch( error => console.error(error) );
}

$(document).ready(function(){
    if(document.getElementById("loginuser") != null)
        document.getElementById("loginuser").onclick = login;
    if(document.getElementById("createuser") != null)
        document.getElementById("createuser").onclick = createUser;
})