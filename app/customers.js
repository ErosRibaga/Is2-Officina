const express = require('express');
const router = express.Router();
const Customer = require('./models/customer');
const Car = require('./models/car');
const { isAdmin } = require('./permissions');

/**
 * @swagger
 * /customer/{id}:
 *  put:
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
 *      '404':
 *        description: Customer not found
 */
router.put('/:id', async (req, res) => {
  let customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
  });

  res
    .location('/api/v1/customers/' + req.params.id)
    .status(204)
    .send();
});

/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Customer not found
 */
router.get('/', isAdmin(true), async (req, res) => {
  let customers = await Customer.find({});

  customers = customers.map((customer) => {
    return {
      self: '/api/v1/customers/' + customer.id,
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
 *    description: Use to get a customer by its id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The customer's id
 *        type: string
 *    responses:
 *      '200':
 *        description: Customer successfully removed
 *      '404':
 *        description: Customer not found
 */
router.get('/:id', async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  res.status(200).json({
    self: '/api/v1/customers/' + customer.id,
    name: customer.name,
    surname: customer.surname,
    phone: customer.phone,
  });
});

/**
 * @swagger
 * /customers:
 *  post:
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
 */
router.post('', async (req, res, next) => {
  if (!req.body.name) {
    res.status(400).json({ error: 'Name not specified' });
    return;
  }

  if (!req.body.surname) {
    res.status(400).json({ error: 'Surname not specified' });
    return;
  }

  if (!req.body.phone) {
    res.status(400).json({ error: 'Phone not specified' });
    return;
  }

  console.log(req.body.phone);

  let customers = await Customer.find({ phone: req.body.phone });

  if (customers.length > 0) {
    res.status(409).json({ error: 'Duplicate phone number' }).send();
    return;
  }

  let customer = new Customer({
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
  });

  customer.save(function (err, post) {
    if (err) {
      return next(err);
    }
    res
      .location('/api/v1/customers/' + customer.id)
      .status(201)
      .send('Ciao');
  });
});

/**
 * @swagger
 * /customers/{id}:
 *  delete:
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
router.delete('/:id', async (req, res) => {
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
