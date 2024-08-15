const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  round: Number,
  questionText: String,
  correctPrompt: String,
  category: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});

module.exports = mongoose.model('Question', QuestionSchema);
