const mongoose = require('mongoose');

const mindCheckSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  burnout_indicator: String,
  burnout_insight: String,
  answers: mongoose.Schema.Types.Mixed,
  questions: mongoose.Schema.Types.Mixed,
  history: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MindCheck', mindCheckSchema);
