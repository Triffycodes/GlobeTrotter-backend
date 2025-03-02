// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  highScore: { type: Number, default: 0 },
  recentScores: { type: [Number], default: [] }
});

module.exports = mongoose.model('User', UserSchema);

