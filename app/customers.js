const express = require('express');
const router = express.Router();
const Customer = require('./models/customer');
const Car = require('./models/car');
const { isAdmin } = require('./permissions');

/**
 * @swagger
 * /customer/{id}:
 *  put:
 *    tags: [customers]
 *    description: Use to update a customer data.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The customer's id
 *        type: string
 *      - in: body
 *        name: body
 *        description: The customer to update
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
 *            phone:
 *              type: string
 *              description: The customer's phone number.
 *              example: 3483493698
 *    responses:
 *      '204':
 *        description: Customer successfully updated
 *      '409':
 *        description: Phone number already exists
 *      '404':
 *        description: Customer not found
 */
 router.put('/:id', isAdmin(true), async (req, res) => {
  try {
    let customer = await Customer.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
    });

    await customer.save();

    return res
      .location('/api/v2/customers/' + customer.id)
      .status(201)
      .send();
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: 'Phone already exists' });
    }
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }
});

/**
 * @swagger
 * /customers:
 *  get:
 *    tags: [customers]
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', isAdmin(true), async (req, res) => {
  let customers = await Customer.find({});

  customers = customers.map((customer) => {
    return {
      self: '/api/v2/customers/' + customer.id,
      name: customer.name,
      surname: customer.surname,
      phone: customer.phone,
    };
  });
  res.status(200).json(customers);
});

/**
 * @swagger
 * /customers/{id}:
 *  get:
 *    tags: [customers]
 *    description: Use to get a customer by its id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The customer's id
 *        type: string
 *    responses:
 *      '200':
 *        description: Customer successfully retrieved
 *      '404':
 *        description: Customer not found
 */
router.get('/:id', isAdmin(true), async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  res.status(200).json({
    self: '/api/v2/customers/' + customer.id,
    name: customer.name,
    surname: customer.surname,
    phone: customer.phone,
  });
});

/**
 * @swagger
 * /customers/{id}/cars:
 *  get:
 *    tags: [customers]
 *    description: Use to get a the car associated to a customer
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The customer's id
 *        type: string
 *    responses:
 *      '200':
 *        description: Customer's cars successfully retrieved
 *      '404':
 *        description: Customer not found
 */
router.get('/:id/cars', isAdmin(true), async (req, res) => {
  try {
      const cars = await Car.find({ owner: req.params.id })
      return res.status(200).json(cars)
  } catch (err) {
      console.log(err)
      return res.status(404).send({ message: 'User not found' })
  }
});

/**
 * @swagger
 * /customers:
 *  post:
 *   tags: [customers]
 *   description: Use to insert a new customer.
 *   parameters:
 *     - in: body
 *       name: body
 *       description: The customer to create
 *       schema:
 *         type: object
 *         required:
 *           - 'name'
 *           - 'surname'
 *           - 'phone'
 *         properties:
 *           name:
 *             type: string
 *             description: The customer's name.
 *             example: Paolo
 *           surname:
 *             type: string
 *             description: The customer's surname.
 *             example: Frinzi
 *           phone:
 *             type: string
 *             description: The customer's phone number.
 *             example: 3483493698
 *   responses:
 *     '201':
 *        description: Customer successfully inserted
 *     '400':
 *        description: Some fields are empty or undefined
 *     '409':
 *        description: Phone already exists
 */
router.post('', isAdmin(true), async (req, res, next) => {
  let customer = new Customer({
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
  });

  try {
    await customer.save();

    return res
      .location('/api/v2/customers/' + customer.id)
      .status(201)
      .send();
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: 'Phone already exists' });
    }
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *  delete:
 *    tags: [customers]
 *    description: Use to delete a customer
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The customer's id
 *        type: string
 *    responses:
 *      '204':
 *        description: Customer successfully removed
 *      '404':
 *        description: Customer not found
 */
router.delete('/:id', isAdmin(true), async (req, res) => {
  let customer = await Customer.findById(req.params.id).exec();
  if (!customer) {
    res.status(404).send();
    console.log('Customer not found');
    return;
  }

  //Check if the customer has any cars, in that case it cannot be deleted
  let cars = await Car.find({ owner: customer._id });

  if (cars.length != 0) {
    res.status(403).send();
    console.log('Cannot delete the customer, it has any cars associated to it');
    return;
  }

  await customer.deleteOne();
  console.log('customer removed');
  res.status(204).send();
});

module.exports = router;
