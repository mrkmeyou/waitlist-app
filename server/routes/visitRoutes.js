// server/routes/visitRoutes.js

const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit'); // Import your Visit model

// Get all visits
router.get('/', async (req, res) => {
  try {
    const visits = await Visit.find();
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific visit
router.get('/:id', async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
