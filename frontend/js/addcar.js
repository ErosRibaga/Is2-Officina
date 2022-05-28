function insertCar() {

    var carBrand = document.getElementById("textBrand").value;
    var carModel = document.getElementById("textModel").value;
    var carPlate = document.getElementById("textPlate").value.toUpperCase();
    var carDescription = document.getElementById("textDescription").value;
    var carOwner = document.getElementById("textOwner").value;

    console.log("Data: " + carBrand + ", " + carModel + ", " + carPlate + ", " + carDescription + ", " + carOwner);

    fetch('http://localhost:8080/api/v1/cars/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            brand: carBrand,
            model: carModel,
            plate: carPlate,
            description: carDescription,
            owner: carOwner
        }),
    })
    .then((resp) => {
        console.log(resp);
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}