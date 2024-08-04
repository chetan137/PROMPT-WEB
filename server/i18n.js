// server/i18n.js
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const Middleware = require('i18next-express-middleware');
const path = require('path');

i18next
  .use(Backend)
  .use(Middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es'], // Add more languages as needed
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json')
    },
    detection: {
      order: ['cookie', 'querystring', 'session', 'header'],
      caches: ['cookie']
    }
  });

module.exports = i18next;
