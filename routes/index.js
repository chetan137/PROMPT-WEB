const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

let user = null;

// Home Page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'AI Prompt Engineering',
        user: user
    });
});

// Courses Page
router.get('/courses', (req, res) => {
    res.render('courses', {
        title: 'Courses',
        user: user
    });
});

router.get('/feed', (req, res) => {
    res.render('feed', {
        title: 'feedback',
        user: user
    });
});

// AI Tools Page
router.get('/aitools', (req, res) => {
    res.render('aitools', {
        title: 'AI Tools',
        user: user
    });
});

// Team Page
router.get('/team', (req, res) => {
    res.render('team', {
        title: 'Our Team',
        user: user
    });
});

// Feedback Page
router.get('/feedback', (req, res) => {
    res.render('feedback', {
        title: 'Feedback',
        user: user
    });
});

// Contact Page
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
        user: user
    });
});

module.exports = router;
