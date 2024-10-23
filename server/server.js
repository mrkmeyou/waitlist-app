// server.js (or routes file)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock database
let visits = [];

// Get all visits
app.get('/api/visits', (req, res) => {
  res.json(visits);
});

// Create a new visit
app.post('/api/visits', (req, res) => {
  const newVisit = {
    id: visits.length + 1,
    customerName: req.body.customerName,
    phoneNumber: req.body.phoneNumber,
    partySize: req.body.partySize,
  };
  visits.push(newVisit);
  res.status(201).json(newVisit);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
