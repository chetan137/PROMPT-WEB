const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  round: Number,
  questionText: String,
  correctPrompt: String,
  category: String   
});

module.exports = mongoose.model('Question', QuestionSchema);
