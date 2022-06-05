const mongoose = require('mongoose');

//Define the schema
const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  plate: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'customers', 
    default: undefined
    },
});


//Create and export the model based on the car schema
module.exports = mongoose.model('cars', carSchema, 'cars');

/*
Schema:

Auto
- id
- marca: string
- modello: string
- targa: string
- descrizione: string
- proprietario: utente
*/

