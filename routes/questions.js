const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const questionController = require('../controllers/questionController');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });



router.get('/', questionController.getQuestion);

router.post('/check', questionController.checkAnswer);
router.post('/generate', questionController.generateQuestions);


module.exports = router;
