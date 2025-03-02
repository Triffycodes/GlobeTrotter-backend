// backend/models/Destination.js
const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  clues: { type: [String], required: true },
  fun_fact: { type: [String] },
  trivia: { type: [String] }
});

module.exports = mongoose.model('Destination', DestinationSchema);
