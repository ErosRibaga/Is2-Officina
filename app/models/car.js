const mongoose = require('mongoose');

//Define the schema
const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  plate: String,
  description: String,
  owner: String
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
- proprietario: utente*/
