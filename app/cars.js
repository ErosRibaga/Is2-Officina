const express = require('express');
const router = express.Router();
const Car = require('./models/car');
const Operation = require('./models/operation');
const mongoose = require('mongoose');
const { isAdmin } = require('./permissions');


/**
 * @swagger
 * /cars/{id}:
 *  put:
 *    tags: [cars]
 *    description: Use to update a car's data.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The car's id
 *        type: string
 *      - in: body
 *        name: body
 *        description: The car to update
 *        schema:
 *          type: object
 *          required:
 *            - 'brand'
 *            - 'model'
 *            - 'plate'
 *            - 'description'
 *            - 'owner'
 *          properties:
 *            brand:
 *              type: string
 *              description: The car's brand.
 *              example: Volvo
 *            model:
 *              type: string
 *              description: The car's model.
 *              example: XC70
 *            plate:
 *              type: string
 *              description: The car's plate.
 *              example: AA000AA
 *            description:
 *              type: string
 *              description: The car's description.
 *              example: black, damaged
 *            owner:
 *              type: object
 *              description: The car's owner.
 *              example: {}
 *    responses:
 *      '204':
 *        description: Car successfully updated
 *      '400':
 *        description: Some fields are empty or undefined
 *      '404':
 *        description: Car not found
 */
 router.put('/:id', isAdmin(true), async (req, res) => {
  try {
    if(req.body.owner == undefined || req.body.brand == "" || req.body.model == "" || req.body.plate == "" || req.body.description == ""){
      return res
        .status(400)
        .json({ error: 'Some fields are empty or undefined' });
    }

    let car = await Car.findByIdAndUpdate(req.params.id, {
      brand: req.body.brand,
      model: req.body.model,
      plate: req.body.plate,
      description: req.body.description,
      owner: mongoose.Types.ObjectId(req.body.owner),
    });

    await car.save();

    return res
      .location('/api/v2/cars/' + car.id)
      .status(201)
      .send();
  }
  catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: 'Plate already exists' });
    }
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }
});

/**
 * @swagger
 * /cars:
 *  post:
 *   tags: [cars]
 *   description: Use to insert a new car.
 *   parameters:
 *     - in: body
 *       name: body
 *       description: The car to insert
 *       schema:
 *         type: object
 *         required:
 *           - 'brand'
 *           - 'model'
 *           - 'plate'
 *           - 'description'
 *           - 'owner'
 *         properties:
 *           brand:
 *             type: string
 *             description: The car's brand.
 *             example: Volvo
 *           model:
 *             type: string
 *             description: The car's model.
 *             example: XC70
 *           plate:
 *             type: string
 *             description: The car's plate.
 *             example: AA000AA
 *           description:
 *             type: string
 *             description: The car's description.
 *             example: black, damaged
 *           owner:
 *             type: object
 *             description: The car's owner.
 *             example: {}
 *   responses:
 *     '204':
 *       description: Car successfully inserted
 *     '400':
 *       description: Some fields are empty or undefined
 *     '409':
 *       description: Plate already exists
 */
 router.post('', isAdmin(true), async (req, res) => {
  let car = new Car({
    brand: req.body.brand,
    model: req.body.model,
    plate: req.body.plate,
    description: req.body.description,
    owner: mongoose.Types.ObjectId(req.body.owner),
  });

  if(req.body.owner == undefined){
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }

  try {
    await car.save();

    return res
      .location('/api/v2/cars/' + car.id)
      .status(201)
      .send();
  }
  catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: 'Plate already exists' });
    }
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }

});


/**
 * @swagger
 * /cars:
 *  get:
 *    tags: [cars]
 *    description: Use to request all cars
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', isAdmin(true), async (req, res) => {
  let cars = await Car.find({}).populate('owner');

  cars = cars.map((car) => {
    return {
      self: '/api/v2/cars/' + car.id,
      brand: car.brand,
      model: car.model,
      plate: car.plate,
      description: car.description,
      owner: car.owner,
    };
  });
  res.status(200).json(cars);
});

/**
 * @swagger
 * /cars/{id}:
 *  get:
 *    tags: [cars]
 *    description: Use to get a car by its id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The car's id
 *        type: string
 *    responses:
 *      '200':
 *        description: Car successfully retrieved
 *      '404':
 *        description: Car not found
 */
router.get('/:id', isAdmin(true), async (req, res) => {
  let car = await Car.findById(req.params.id).populate('owner');
  res.status(200).json({
    self: '/api/v2/car/' + car.id,
    brand: car.brand,
    model: car.model,
    plate: car.plate,
    description: car.description,
    owner: car.owner,
  });
});


/**
 * @swagger
 * /cars/{id}:
 *  delete:
 *    tags: [cars]
 *    description: Use to delete a car
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The car's id
 *        type: string
 *    responses:
 *      '204':
 *        description: Car successfully removed
 *      '403':
 *        description: Cannot delete the car, it has some operations associated to it
 *      '404':
 *        description: Car not found
 */
router.delete('/:id', isAdmin(true), async (req, res) => {
  let car = await Car.findById(req.params.id).exec();

  if (!car) {
    res.status(404).send();
    return;
  }

  //Check if the user is associated with any operations, in that case it cannot be deleted
  let operations = await Operation.find({ car: car._id });

  if (operations.length != 0) {
    res.status(403).send();
    return;
  }

  await car.deleteOne();
  res.status(204).send();
});

module.exports = router;
