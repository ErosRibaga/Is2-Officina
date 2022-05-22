const express = require('express');
const router = express.Router();
const Operation = require('./models/operation');

/**
 * @swagger
 * /operations:
 *  get:
 *    tags: [operations]
 *    description: Use to request all operations
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Operation not found
 */
router.get('/', async (req, res) => {
  let operations = await Operation.find({});

  operations = operations.map((operation) => {
    return {
      self: '/api/v1/operations/' + operation.id,
      title: operation.title,
      description: operation.description,
      employee: operation.employee,
      startDate: new Date(operation.startDate),
      endDate: new Date(operation.endDate),
      car: operation.car,
    };
  });
  res.status(200).json(operations);
});

/**
 * @swagger
 * /operations/{id}:
 *  delete:
 *    tags: [operations]
 *    description: Use to delete an operation
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The operation's id
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Operation successfully removed
 *      '404':
 *        description: Operation not found
 */
router.delete('/:id', async (req, res) => {
  let operation = await Operation.findById(req.params.id).exec();
  if (!operation) {
    res.status(404).send();
    console.log('Operation not found');
    return;
  }
  await operation.deleteOne();
  console.log('Operation removed');
  res.status(204).send();
});

/**
 * @swagger
 * /operations/{id}:
 *  put:
 *    tags: [operations]
 *    description: Use to update an operation.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: The operations's title.
 *                example: asd87658af
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The operation's id
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Operation successfully updated
 *      '404':
 *        description: Operation not found
 */
router.put('/:id', async (req, res) => {
  let operation = await Operation.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    employee: req.body.employee,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    car: req.body.car,
  });

  res
    .location('/api/v1/operations/' + req.params.id)
    .status(204)
    .send();
});

/**
 * @swagger
 * /operations/{id}:
 *  get:
 *    tags: [operations]
 *    description: Use to get an operation by its id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The operation's id
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Operation successfully removed
 *      '404':
 *        description: Operation not found
 */
router.get('/:id', async (req, res) => {
  let operation = await Operation.findById(req.params.id);
  res.status(200).json({
    self: '/api/v1/operations/' + operation.id,
    title: operation.title,
    description: operation.description,
    employee: operation.employee,
    startDate: new Date(operation.startDate),
    endDate: new Date(operation.endDate),
    car: operation.car,
  });
});

/**
 * @swagger
 * /operations:
 *  post:
 *    tags: [operations]
 *    description: Use to insert a new operation.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: The operations's title.
 *                example: asd87658af
 *    responses:
 *      '201':
 *        description: Operation successfully inserted
 */
router.post('', async (req, res) => {
  let operation = new Operation({
    title: req.body.title,
    description: req.body.description,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    employee: req.body.employee,
    car: req.body.car,
  });

  operation = await operation.save();

  let operationId = operation.id;

  res
    .location('/api/v1/operations/' + operationId)
    .status(201)
    .send();
});

//export the router to use it in the index.js
module.exports = router;
