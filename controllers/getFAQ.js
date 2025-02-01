const FAQ = require('../models/faq');
const redisClient = require('../config/redis'); // Import Redis client from config

const getFAQ = async (req, res) => {
  try {
    let lang = req.query.lang || 'en';
    lang = lang.concat('\n');
    const cacheKey = `faqs:${lang}`;

    const cachedFAQs = await redisClient.get(cacheKey);
    if (cachedFAQs) {
      return res.status(200).json(JSON.parse(cachedFAQs));
    }

    const faqs = await FAQ.find({});

    const translatedFAQs = faqs
      .map((faq) => {
        const translation = faq.translations.find((t) => t.lang === lang);
        return translation
          ? {
              id: faq.id,
              question: translation.question,
              answer: translation.answer,
            }
          : null;
      })
      .filter(Boolean);

    const response = { 'Total Count': faqs.length, translatedFAQs };

    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 1800 });

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
};

module.exports = getFAQ;
