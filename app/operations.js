const express = require('express');
const router = express.Router();
const Operation = require('./models/operation');
const mongoose = require('mongoose');
const { scopedOperations, canViewOperation } = require('./permissions');

/**
 * @swagger
 * /operations:
 *  get:
 *    tags: [operations]
 *    description: Use to request all operations
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', async (req, res) => {
  let operations = await Operation.find({}).populate('employee').populate('car').exec();

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
  res.status(200).json(scopedOperations(req.loggedUser, operations));
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
 *        type: string
 *    responses:
 *      '204':
 *        description: Operation successfully removed
 *      '404':
 *        description: Operation not found
 */
router.delete('/:id', isAdmin(true), async (req, res) => {
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
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The operation's id
 *        type: string
 *      - in: body
 *        name: body
 *        description: The operation to update
 *        schema:
 *          type: object
 *          required:
 *            - 'title'
 *            - 'description'
 *            - 'startDate'
 *            - 'endDate'
 *            - 'employee'
 *            - 'car'
 *          properties:
 *            title:
 *              type: string
 *              description: The operations's title.
 *              example: Cambio gomme
 *            description:
 *              type: string
 *              description: The operations's description.
 *              example: Sostituzione pneumatici 155/70
 *            starDate:
 *              type: Date
 *              description: The operations's startDate.
 *              example: 2022-05-06T09:30:00.000Z
 *            endDate:
 *              type: Date
 *              description: The operations's endDate.
 *              example: 2022-05-06T11:00:00.000Z
 *            employee:
 *              type: Object
 *              description: The employee who's gonna do the operation.
 *              example: {}
 *            car:
 *              type: string
 *              description: The car on which the employee is gonna operate.
 *              example: {}
 *    responses:
 *      '204':
 *        description: Operation successfully updated
 *      '400':
 *        description: Some fields are empty or undefined
 *      '427':
 *        description: Start date must be before end date
 *      '404':
 *        description: Operation not found
 */
 router.put('/:id', isAdmin(true), async (req, res) => {
  try {
    if (req.body.employee == undefined || req.body.car == undefined || req.body.title == "" || req.body.description == "") {
      return res
        .status(400)
        .json({ error: 'Some fields are empty or undefined' });
    }

    if (req.body.startDate > req.body.endDate) {
      res.status(400).json({ error: 'Start date must be before end date' });
      return;
    }

    let operation = await Operation.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      employee: mongoose.Types.ObjectId(req.body.employee),
      car: mongoose.Types.ObjectId(req.body.car),
    });

    await operation.save();

    return res
      .location('/api/v1/operations/' + operation.id)
      .status(201)
      .send();
  }
  catch (err) {
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }
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
 *        type: string
 *    responses:
 *      '200':
 *        description: Operation successfully retrieved
 *      '404':
 *        description: Operation not found
 */
router.get('/:id', async (req, res) => {
  let operation = await Operation.findById(req.params.id).populate('employee').populate('car');

  if (canViewOperation(req.loggedUser, operation)) {
    res.status(200).json({
      self: '/api/v1/operations/' + operation.id,
      title: operation.title,
      description: operation.description,
      employee: operation.employee,
      startDate: new Date(operation.startDate),
      endDate: new Date(operation.endDate),
      car: operation.car,
    });
  }
});

/**
 * @swagger
 * /operations:
 *  post:
 *    tags: [operations]
 *    description: Use to insert a new operation.
 *    parameters:
 *      - in: body
 *        name: body
 *        description: The operation to create
 *        schema:
 *          type: object
 *          required:
 *            - 'title'
 *            - 'description'
 *            - 'startDate'
 *            - 'endDate'
 *            - 'employee'
 *            - 'car'
 *          properties:
 *            title:
 *              type: string
 *              description: The operations's title.
 *              example: Cambio gomme
 *            description:
 *              type: string
 *              description: The operations's description.
 *              example: Sostituzione pneumatici 155/70
 *            starDate:
 *              type: Date
 *              description: The operations's startDate.
 *              example: 2022-05-06T09:30:00.000Z
 *            endDate:
 *              type: Date
 *              description: The operations's endDate.
 *              example: 2022-05-06T11:00:00.000Z
 *            employee:
 *              type: Object
 *              description: The employee who's gonna do the operation.
 *              example: {}
 *            car:
 *              type: string
 *              description: The car on which the employee is gonna operate.
 *              example: {}
 *    responses:
 *      '201':
 *        description: Operation successfully inserted
 *      '400':
 *        description: Some fields are empty or undefined
 *      '427':
 *        description: Start date must be before end date
 */
router.post('', isAdmin(true), async (req, res) => {
  let operation = new Operation({
    title: req.body.title,
    description: req.body.description,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    employee: mongoose.Types.ObjectId(req.body.employee),
    car: mongoose.Types.ObjectId(req.body.car),
  });

  if (req.body.employee == undefined || req.body.car == undefined) {
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }

  if(req.body.startDate > req.body.endDate){
    res.status(427).json({ error: 'Start date must be before end date' });
    return;
  }

  try {
    await operation.save();

    return res
      .location('/api/v1/operations/' + operation.id)
      .status(201)
      .send();
  }
  catch (err) {
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }
});

//export the router to use it in the index.js
module.exports = router;
