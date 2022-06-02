const express = require('express');
const router = express.Router();
const Car = require('./models/car');
const Operation = require('./models/operation');
const mongoose = require('mongoose');

router.put('/:id', async (req, res) => {
  let car = await Car.findByIdAndUpdate(req.params.id, {
    brand: req.body.brand,
    model: req.body.model,
    plate: req.body.plate,
    description: req.body.description,
    owner: mongoose.Types.ObjectId(req.body.owner),
  });

  res
    .location('/api/v1/cars/' + req.params.id)
    .status(204)
    .send();
});

/**
 * @swagger
 * /customers:
 *  post:
 *    tags: [customers]
 *    description: Use to insert a new customer.
 *    parameters:
 *      - in: body
 *        name: body
 *        description: The customer to create
 *        schema:
 *          type: object
 *          required:
 *            - 'name'
 *            - 'surname'
 *            - 'phone'
 *          properties:
 *            name:
 *              type: string
 *              description: The customer's name.
 *              example: Paolo
 *            surname:
 *              type: string
 *              description: The customer's surname.
 *              example: Frinzi
 *             phone:
 *              type: string
 *              description: The customer's phone number.
 *              example: 3483493698
 *
 *    responses:
 *      '201':
 *        description: Customer successfully inserted
 */
router.post('', async (req, res) => {
  let car = new Car({
    brand: req.body.brand,
    model: req.body.model,
    plate: req.body.plate,
    description: req.body.description,
    owner: mongoose.Types.ObjectId(req.body.owner),
  });

  car = await car.save();

  let carId = car.id;

  res
    .location('/api/v1/cars/' + carId)
    .status(201)
    .send();
});

router.get('/', async (req, res) => {
  let cars = await Car.find({}).populate('owner');

  cars = cars.map((car) => {
    return {
      self: '/api/v1/cars/' + car.id,
      brand: car.brand,
      model: car.model,
      plate: car.plate,
      description: car.description,
      owner: car.owner,
    };
  });
  res.status(200).json(cars);
});

router.get('/:id', async (req, res) => {
  let car = await Car.findById(req.params.id).populate('owner');
  res.status(200).json({
    self: '/api/v1/car/' + car.id,
    brand: car.brand,
    model: car.model,
    plate: car.plate,
    description: car.description,
    owner: car.owner,
  });
});

router.delete('/:id', async (req, res) => {
  let car = await Car.findById(req.params.id).exec();

  if (!car) {
    res.status(404).send();
    console.log('car not found');
    return;
  }

  //Check if the user is associated with any operations, in that case it cannot be deleted
  let operations = await Operation.find({ car: car._id });

  if(operations.length != 0) {
    res.status(403).send();
    console.log('Cannot delete the car, it has some operations associated to it');
    return;
  }

  await car.deleteOne();
  console.log('car removed');
  res.status(204).send();
});

module.exports = router;
