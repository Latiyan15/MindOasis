const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  ai_analysis_allowed: { type: Boolean, default: false },
  emotion_tone: String,
  stress_trigger: String,
  sentiment_score: String,
  images: String, // Stringified JSON or URL
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Journal', journalSchema);
