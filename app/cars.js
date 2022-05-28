const express = require('express');
const router = express.Router();
const Car = require('./models/car');


 router.put('/:id', async (req, res) => {
  let customer = await Car.findByIdAndUpdate(req.params.id, {
    brand: req.body.brand,
    model: req.body.model,
    plate: req.body.plate,
    description: req.body.description,
    owner: req.body.owner
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
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
  });

  car = await car.save();

  let carId = car.id;

  res
    .location('/api/v1/cars/' + carId)
    .status(201)
    .send();
});


router.get('/', async (req, res) => {
  
  let cars = await Car.find({});

  console.log(req.body);

  cars = cars.map((car) => {
    return {
      self: '/api/v1/car/' + car.id,
      brand: car.brand,
      model: car.model,
      plate: car.plate,
      description: car.description,
      owner: car.owner
    };
  });
  res.status(200).json(cars);
});



router.get('/:id', async (req, res) => {
  let car = await Car.findById(req.params.id);
  res.status(200).json({
    self: '/api/v1/car/' + car.id,
    brand: car.brand,
    model: car.model,
    plate: car.plate,
    description: car.description,
    owner: car.owner
  });
});



router.delete('/:id', async (req, res) => {
  let car = await Car.findById(req.params.id).exec();
  if (!car) {
      res.status(404).send();
      console.log('car not found');
      return;
  }
  await car.deleteOne();
  console.log('car removed');
  res.status(204).send();
});

module.exports = router;