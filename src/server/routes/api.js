const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const MindCheck = require('../models/MindCheck');

// --- Moods ---
router.get('/moods', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ timestamp: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/moods', async (req, res) => {
  try {
    const mood = new Mood(req.body);
    await mood.save();
    res.status(201).json(mood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Journals ---
router.get('/journals', async (req, res) => {
  try {
    const journals = await Journal.find().sort({ timestamp: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/journals', async (req, res) => {
  try {
    const journal = new Journal(req.body);
    await journal.save();
    res.status(201).json(journal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- MindChecks ---
router.get('/mindchecks', async (req, res) => {
  try {
    const mindchecks = await MindCheck.find().sort({ timestamp: -1 });
    res.json(mindchecks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/mindchecks', async (req, res) => {
  try {
    const mindcheck = new MindCheck(req.body);
    await mindcheck.save();
    res.status(201).json(mindcheck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
