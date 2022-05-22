const express = require('express');
const router = express.Router();
const Customer = require('./models/customer');

router.post('', async (req, res) => {
    let customer = new Customer({
      nome: req.body.nome,
      cognome: req.body.cognome,
      codiceFiscale: req.body.codiceFiscale,
    });
  
    customer = await customer.save();
  
    let customerId = customer.id;
  
    res
      .location('/api/v1/customers/' + customerId)
      .status(201)
      .send();
  });

  router.get('/', async (req, res) => {
    
    let customers = await Customer.find({});
  
    console.log(req.body);
  
    customers = customers.map((customer) => {
      return {
        self: '/api/v1/customer/' + customer.id,
        nome: customer.nome,
        cognome: customer.cognome,
        codiceFiscale: customer.codiceFiscale,
      };
    });
    res.status(200).json(customers);
  });

  /*
  router.get('/customer/:customer', async (req, res) => {
    let curYear = new Date().getFullYear();
    console.log(curYear);
  
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
        employee: operation.employee,
        car: operation.car,
      };
    });
    res.status(200).json(operations);
  });*/

  //aggiungerlo a index.js
  module.exports = router;
