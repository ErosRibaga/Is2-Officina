const mongoose = require('mongoose');

//Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    type: Boolean,
    default: false,
    required: true,
  },
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('users', userSchema, 'users');
