const FAQ = require('../models/faq');
const { translateLanguage } = require('../utils/google_translate');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../config/redis'); // Import Redis client from config

const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'ja'];

const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const uid = uuidv4();
    const cacheKey = `faq:${uid}`;

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

    const newFAQ = new FAQ({ uid, translations });
    await newFAQ.save();

    await redisClient.set(cacheKey, JSON.stringify(newFAQ), { EX: 1800 });

    res.status(201).json(newFAQ);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating FAQ' });
  }
};

module.exports = createFAQ;
