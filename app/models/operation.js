const mongoose = require('mongoose');

//Define the schema
const operationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: { type: Date, default: new Date() },
  endDate: Date,
  comments: [{ author: String, body: String, date: Date }],
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, default: undefined },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'cars', required: true, default: undefined },
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
