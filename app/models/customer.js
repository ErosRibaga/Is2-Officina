const mongoose = require('mongoose');

//Define the schema
const customerSchema = new mongoose.Schema({
  nome: String, 
  cognome: String,
  codiceFiscale: String,
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('customers', customerSchema, 'customers');
