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
        //console.log(data);
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        //loggedUser.role = data.role;
        document.cookie = "token=" + data.token;
        document.cookie = "admin=" + data.admin;
        //loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        //document.getElementById("loggedUser").textContent = loggedUser.email;
        /*fetch('../frontend/agenda.html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: data.token,
            }),
        })*/
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
    var role = document.getElementById("roles").value;

    fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            { 
                name : name,
                surname: surname,
                email: email, 
                password: password ,
                role: role
            }),
    })
    .then((resp) => {
        redirect('/frontend/login.html');
    })
    .catch( error => console.error(error) );
}

$(document).ready(function(){
    if(document.getElementById("loginuser") != null)
        document.getElementById("loginuser").onclick = login;
    if(document.getElementById("createuser") != null)
        document.getElementById("createuser").onclick = createUser;
})