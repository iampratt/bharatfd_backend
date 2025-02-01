const FAQ = require('../models/faq');
const {
  translateLanguage,
  detectLanguage,
} = require('../utils/google_translate');
const { v4: uuidv4 } = require('uuid');

const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'ja'];

const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const lang = await detectLanguage(question);
    const uid = uuidv4();
    const translations = await Promise.all(
      SUPPORTED_LANGUAGES.map(async (language) => {
        const translatedQuestion = await translateLanguage(question, language);
        const translatedAnswer = await translateLanguage(answer, language);
        return {
          lang: language,
          question: translatedQuestion,
          answer: translatedAnswer,
        };
      })
    );

    const newFAQ = new FAQ({
      uid,
      translations,
    });

    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating FAQ' });
  }
};

module.exports = createFAQ;
