const FAQ = require('../models/faq');
const { translateLanguage } = require('../utils/google_translate');
const redisClient = require('../config/redis'); // Import Redis client from config

const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'ja'];

const updateFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const { id } = req.params;

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

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { translations },
      { new: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    const cacheKey = `faq:${id}`;
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(updatedFAQ)); // Cache updated FAQ for 1 hour

    res.status(200).json(updatedFAQ);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating FAQ' });
  }
};

module.exports = updateFAQ;
