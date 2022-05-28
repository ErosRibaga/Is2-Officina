const mongoose = require('mongoose');

//Define the schema
const userSchema = new mongoose.Schema({
  name: String, 
  surname: String,
  password: String,
  mail: String,
  role:{
    type: String, 
    enum: ['admin', 'employee'],         
    default: 'employee',
  },
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('users', userSchema, 'users');