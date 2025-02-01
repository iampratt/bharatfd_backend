const FAQ = require('../models/faq');
const { translateText } = require('../utils/google_translate');
const redisClient = require('../config/redis'); // Import Redis client from config

const getFAQ = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;

    const cachedFAQs = await redisClient.get(cacheKey);
    if (cachedFAQs) {
      return res.status(200).json(JSON.parse(cachedFAQs));
    }

    const faqs = await FAQ.find({});

    if (lang !== 'en') {
      for (const faq of faqs) {
        const translation = faq.translations.find((t) => t.lang === lang);
        if (translation) {
          faq.question = translation.question;
          faq.answer = translation.answer;
        }
      }
    }

    const response = { 'Total Count': faqs.length, faqs };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // Cache for 1 hour

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
};

module.exports = getFAQ;
