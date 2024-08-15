require('dotenv').config();

module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3000,
  HF_TOKEN: process.env.HF_TOKEN,
};
