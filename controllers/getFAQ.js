const FAQ = require('../models/faq');
const { translateText } = require('../services/google_translate');

const getFAQ = async (req, res) => {
  try {
    const lang = req.query.lang;
    const faqs = await FAQ.find({});

    const translatedFAQs = await Promise.all(
      faqs.map(async (faq) => ({
        question: await translateText(faq.question, lang),
        answer: faq.answer,
      }))
    );
    res.json(translatedFAQs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
};

module.exports = getFAQ;
