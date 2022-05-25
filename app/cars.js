router.post('', async (req, res) => {

	let car = new Car({
        brand: req.body.brand,
        model: req.body.model,
        plate: req.body.plate,
        description: req.body.description,
        owner: req.body.owner
    });
    
	car = await car.save();
    
    let carId = car.id;

    console.log('car saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/car/" + carId).status(201).send();
}); 

 //get a car by the Id
router.get('/:id', async (req, res) => {
  let operation = await Operation.findById(req.params.id);
  res.status(200).json({
    self: '/api/v1/cars/' + operation.id,
    targa: car.targa,
    modello: car.modello,
    anno: car.anno,
    proprietario: car.proprietario,
  });
});