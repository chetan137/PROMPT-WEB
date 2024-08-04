const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  category: String,
  progress: Number
});

module.exports = mongoose.model('User', UserSchema);
