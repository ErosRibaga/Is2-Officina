const mongoose = require('mongoose');

//Define the schema
const customerSchema = new mongoose.Schema({
  name: String, 
  surname: String,
  phone: String,
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('customers', customerSchema, 'customers');