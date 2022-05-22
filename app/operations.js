const express = require('express');
const router = express.Router();
const Operation = require('./models/operation');

//get all the operations
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

//Update an new operation
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

//get an operation by the Id
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

//get al the operations that start or end in the selected month
router.get('/month/:month', async (req, res) => {
  let curYear = new Date().getFullYear();

  let operations = await Operation.find({
    $or: [
      {
        $and: [
          { startDate: { $gt: curYear + '-' + req.params.month + '-01' } },
          { startDate: { $lt: curYear + '-' + req.params.month + '-31' } },
        ],
      },
      {
        $and: [
          { endDate: { $gt: curYear + '-' + req.params.month + '-01' } },
          { endDate: { $lt: curYear + '-' + req.params.month + '-31' } },
        ],
      },
    ],
  });

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

//Insert a new operation
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
