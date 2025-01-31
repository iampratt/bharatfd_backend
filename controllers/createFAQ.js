const FAQ = require('../models/faq');
const { translateText } = require('../services/google_translate');

const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const translations = {
      en: question,
      hi: await translateText(question, 'hi'),
      ja: await translateText(question, 'ja'),
      es: await translateText(question, 'es'),
      fr: await translateText(question, 'fr'),
    };

    const faq = await FAQ.create({ question, answer, translations });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Error creating FAQ' });
  }
};

module.exports = createFAQ;
