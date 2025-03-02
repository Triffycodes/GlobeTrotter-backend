// backend/routes/destinations.js
const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// POST: Insert a single destination (for admin use)
router.post('/', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Batch insert multiple destinations
router.post('/batch', async (req, res) => {
  try {
    const destinations = req.body;
    const result = await Destination.insertMany(destinations);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve a random destination
router.get('/random', async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Retrieve random city options (excluding a given city)
router.get('/options', async (req, res) => {
  try {
    const exclude = req.query.exclude;
    let filter = {};
    if (exclude) {
      filter.city = { $ne: exclude };
    }
    const docs = await Destination.aggregate([
      { $match: filter },
      { $sample: { size: 3 } }
    ]);
    const options = docs.map(doc => doc.city);
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
