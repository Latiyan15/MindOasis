const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  mood: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mood', moodSchema);
