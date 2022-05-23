const mongoose = require('mongoose');

//Define the schema
const customerSchema = new mongoose.Schema({
  nome: String, 
  cognome: String,
  telefono: String,
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('customers', customerSchema, 'customers');
