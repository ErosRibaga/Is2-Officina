function login() {

    var email = document.getElementById("textmail").value;
    var password = document.getElementById("textpassword").value;

    fetch('http://localhost:8080/api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
    })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) { // Here you get the data to modify as you please

            if (data.success) {
                var loggedUser = {};
                loggedUser.token = data.token;
                loggedUser.email = data.email;
                loggedUser.id = data.id;

                //Create cookies
                document.cookie = "token=" + data.token;
                document.cookie = "admin=" + data.admin;
                if (data.token != undefined || data.admin != undefined) {
                    redirect('/frontend/agenda.html');
                }
            } else {
                $('#error').text(data.message);
            }
            console.log(data);
            return;
        })
        .catch(error => {
            /*console.error(error);
            throw error;*/
        });



}