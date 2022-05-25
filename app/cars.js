const express = require('express');
const router = express.Router();
const Car = require('./models/car');

router.post('', async (req, res) => {

  let car = new Car({
    brand: req.body.brand,
    model: req.body.model,
    plate: req.body.plate,
    description: req.body.description,
    owner: req.body.owner,
  });

  car = await car.save();

  let carId = car.id;

  console.log('car saved successfully');
  res
    .location('/api/v1/cars/' + carId)
    .status(201)
    .send();
});

//get a car by the Id
router.get('/:id', async (req, res) => {
  let car = await Car.findById(req.params.id);
  res.status(200).json({
    self: '/api/v1/cars/' + car.id,
    brand: car.brand,
    model: car.model,
    plate: car.plate,
    description: car.description,
    owner: car.owner,
  });
});

router.get('/', async (req, res) => {
  let cars = await Car.find({});

  cars = cars.map((car) => {
    return {
      self: '/api/v1/operations/' + car.id,
      brand: car.brand,
      model: car.model,
      plate: car.plate,
      description: car.description,
      owner: car.owner,
    };
  });
  res.status(200).json(cars);
});

//export the router to use it in the index.js
module.exports = router;
