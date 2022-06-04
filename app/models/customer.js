const mongoose = require('mongoose');

//Define the schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, 
  surname: {
    type: String,
    required: true,
  }, 
  phone: {
    type: String,
    required: true,
    unique: true,
  }, 
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('customers', customerSchema, 'customers');