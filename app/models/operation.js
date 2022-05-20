const mongoose = require('mongoose');

//Define the schema
const operationSchema = new mongoose.Schema({
  title: String, 
  description: String,
  startDate: { type: Date, default: new Date() },
  endDate: Date,
  comments: [{ author: String, body: String, date: Date }],
  employee: String,
  car: String
});

//Create and export the model based on the operation schema
module.exports = mongoose.model('operations', operationSchema, 'operations');

/*
Schema:

Operazioni
- id
- titolo: string
- descrizione: string
- dataInizio: timeStamp
- dataFine: timeStamp
- commenti: [{
		   autore: utente,
		   testo: string
		}]
- dipendente: utente
- auto: auto*/