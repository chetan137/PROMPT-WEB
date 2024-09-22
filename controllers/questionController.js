const Question = require('../models/Question');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
//const i18next = require('../server/i18n');

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

    // Fetch question specific to the user
    const question = await Question.findOne({ round, userId: user._id }); // Ensures the question is associated with the user
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
  const { category, rounds, userId } = req.body;

  const resMock = res || {
    send: () => {},
    status: () => ({
      send: () => {},
    }),
  };

  try {
    for (let i = 1; i <= rounds; i++) {
      let difficultyLevel = 'easy';
      let sizeWords = i * 10;
      if (i > 4) difficultyLevel = 'medium';
      if (i > 6) difficultyLevel = 'hard';

      const prompt = `Generate a ${difficultyLevel} level question for round ${i} in ${category}. Ensure the question with min words ${sizeWords} is ${
        i === 1 ? 'short and easy ' : 'appropriate for the difficulty level , Question should be on technical side with minimun 2-3 lines so that user can write optimum prompt by seeing that'
      }.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const newQuestion = new Question({
        round: i,
        questionText: text,
        correctPrompt: text,
        category: category,
        userId: userId,
      });

      await newQuestion.save();
    }

    resMock.send('Questions generated successfully');
  } catch (error) {
    console.error('Error generating questions:', error);
    resMock.status(500).send('An error occurred while generating questions');
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
      userProgress: user.progress,
    });
  } catch (error) {
    console.error('Error validating prompt:', error);
    res.status(500).send('An error occurred while validating the prompt');
  }
};

exports.generateCommonPrompt = (questionText, userPrompt) => {
  return `Given the question: "${questionText}", the user provided the following prompt: "${userPrompt}". Generate an optimal prompt for the user to achieve the best results.`;
};
