const mongoose = require('mongoose');

//Define the schema
const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  password: String,
  email: String,
  admin: { type: Boolean, default: false },
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('users', userSchema, 'users');
