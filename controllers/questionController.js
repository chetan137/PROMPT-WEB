const Question = require('../models/Question');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const i18next = require('../server/i18n');
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: { maxOutputTokens: 2000, temperature: 0.9 },
});

exports.getQuestion = async (req, res) => {
  const { userId, round } = req.query;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const question = await Question.findOne({ round, category: user.category });
    if (!question) {
      return res.status(404).send('Question not found');
    }
    res.render('question', { question, userId });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).send('An error occurred while fetching the question');
  }
};

exports.generateQuestions = async (req, res) => {
  const { category, rounds } = req.body;

  try {
    for (let i = 1; i <= rounds; i++) {
      const prompt = `Generate a question for round ${i} for a ${category} learning prompt engineering.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Assuming the text is used for both questionText and correctPrompt
      const questionText = text.trim();
      const correctPrompt = text.trim();  // Adjust if needed

      const newQuestion = new Question({
        round: i,
        questionText: questionText,
        correctPrompt: correctPrompt,
        category: category,
      });

      await newQuestion.save();
    }

    res.send('Questions generated successfully');
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).send('An error occurred while generating questions');
  }
};

exports.checkAnswer = async (req, res) => {
  const { userId, questionId, userPrompt } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).send('Question not found');
    }

    const validationPrompt = `The user prompt is: "${userPrompt}". The correct prompt should be: "${question.correctPrompt}". Is the user prompt correct?`;
    const validationResult = await model.generateContent(validationPrompt);
    const validationText = validationResult.response.text().trim();

    const optimalPromptQuery = `Generate an optimal prompt for the user based on the following question: "${question.questionText}". The user's prompt is: "${userPrompt}".`;
    const optimalPromptResult = await model.generateContent(optimalPromptQuery);
    const optimalPrompt = optimalPromptResult.response.text().trim();

    const isCorrect = validationText.toLowerCase().includes('correct');

    const user = await User.findById(userId);
    if (isCorrect || user.progress < question.round) {
      user.progress = question.round + 1;
      await user.save();
    }

    const nextRound = question.round + 1;

    res.render('feedback', {
      isCorrect,
      correctPrompt: question.correctPrompt,
      optimalPrompt,
      nextRound,
      userId,
      userProgress: user.progress
    });
  } catch (error) {
    console.error('Error validating prompt:', error);
    res.status(500).send('An error occurred while validating the prompt');
  }
};

exports.generateCommonPrompt = (questionText, userPrompt) => {
  return `Given the question: "${questionText}", the user provided the following prompt: "${userPrompt}". Generate an optimal prompt for the user to achieve the best results.`;
};
