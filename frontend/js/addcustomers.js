function insertCustomer() {

    var customerNome = document.getElementById("textNome").value;
    var customerCognome = document.getElementById("textCognome").value;
    var customerTelefono = document.getElementById("textTelefono").value.toUpperCase();

    console.log("Data: " + customerNome + ", " + customerCognome + ", " + customerTelefono);

    fetch('http://localhost:8080/api/v1/customers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            nome: customerNome,
            cognome: customerCognome,
            telefono: customerTelefono,
        }),
    })
    .then((resp) => {
        console.log(resp);
        //loadBooks();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}