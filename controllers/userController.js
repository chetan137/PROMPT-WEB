const User = require('../models/User');
const questionController = require('../controllers/questionController');
const express = require('express');

exports.register = async (req, res) => {
  const { email, category } = req.body;

  try {
    const newUser = new User({ email, category, progress: 0 });
    await newUser.save();

    await questionController.generateQuestions(
      { body: { category, rounds: 10, userId: newUser._id } }
    );
  res.render("login");
  } catch (error) {
    console.error('Error during registration:', error);

    if (!res.headersSent) {
      res.status(500).send('An error occurred during registration');
    }
  }
};



exports.login = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.redirect(`/questions?userId=${user._id}&round=1`);
  } else {
    res.status(400).send('User not found');
  }
};
