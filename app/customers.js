const express = require('express');
const router = express.Router();
const Customer = require('./models/customer');

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
 *    tags: [customers]
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Customer not found
 */
 router.get('/', async (req, res) => {
  
  let customers = await Customer.find({});

  console.log(req.body);

  customers = customers.map((customer) => {
    return {
      self: '/api/v1/customer/' + customer.id,
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
 *        description: Customer successfully removed
 *      '404':
 *        description: Customer not found
 */
router.get('/:id', async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  res.status(200).json({
    self: '/api/v1/customer/' + customer.id,
    name: customer.name,
    surname: customer.surname,
    phone: customer.phone,
  });
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
  let customer = new Customer({
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
  });

  customer = await customer.save();

  let customerId = customer.id;

  res
    .location('/api/v1/customers/' + customerId)
    .status(201)
    .send();
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
router.delete('/:id', async (req, res) => {
  let customer = await Customer.findById(req.params.id).exec();
  if (!customer) {
      res.status(404).send();
      console.log('book not found');
      return;
  }
  await customer.deleteOne();
  console.log('customer removed');
  res.status(204).send();
});

module.exports = router;
