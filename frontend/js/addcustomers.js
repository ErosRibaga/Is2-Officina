function insertCustomer() {

    var customerNome = document.getElementById("textNome").value;
    var customerCognome = document.getElementById("textCognome").value;
    var customerCF = document.getElementById("textCodiceFiscale").value.toUpperCase();

    console.log("Data: " + customerNome + ", " + customerCognome + ", " +customerCF);

    fetch('http://127.0.0.1:8080/api/v1/customers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            nome: customerNome,
            cognome: customerCognome,
            codiceFiscale: customerCF,
        }),
    })
    .then((resp) => {
        console.log(resp);
        //loadBooks();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}