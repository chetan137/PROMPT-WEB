const User = require('../models/User');
const questionController = require('../controllers/questionController');
const express = require('express');
exports.register = async (req, res) => {
  const { email, category } = req.body;
  const newUser = new User({ email, category, progress: 0 });
  await newUser.save();
  req.body.rounds = 10;
    const resMock = {
    send: () => {},
    status: () => ({
      send: () => {}
    }),
  };

      await questionController.generateQuestions({ body: { category, rounds: 10 } }, { send: () => {} });

    res.send('User registered successfully and questions generated');
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
