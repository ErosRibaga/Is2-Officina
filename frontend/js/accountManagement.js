var loggedUser = {};

function login(){

    var mail = document.getElementById("textmail").value;
    var password = document.getElementById("textpassword").value;

    fetch('http://localhost:8080/api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { mail: mail, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        loggedUser.token = data.token;
        loggedUser.mail = data.mail;
        loggedUser.id = data.id;
        loggedUser.self = data.self;
        loggedUser.role = data.role;
        //document.cookie = "token=" + data.token;
        //document.cookie = "role=" + data.role;
        //loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        //document.getElementById("loggedUser").textContent = loggedUser.email;
        fetch('../frontend/agenda.html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: data.token,
            }),
        })
        return;
    })
    .catch( error => console.error(error) );
}

function createUser(){
    
    var name = document.getElementById("textnome").value;
    var surname = document.getElementById("textcognome").value;
    var mail = document.getElementById("textmail").value;
    var password = document.getElementById("textpassword").value;
    var role = document.getElementById("roles").value;

    fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            { 
                name : name,
                surname: surname,
                mail: mail, 
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