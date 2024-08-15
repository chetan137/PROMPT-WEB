const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificateController');

router.get('/certificate/download', generateCertificate);

module.exports = router;
