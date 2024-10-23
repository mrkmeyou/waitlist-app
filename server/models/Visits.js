// server/models/Visit.js

const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  guestCount: { type: Number, required: true },
  waitingTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Visit', visitSchema);
