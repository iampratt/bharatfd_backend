const FAQ = require('../models/faq');
const { translateText } = require('../utils/google_translate');

const getFAQ = async (req, res) => {
  try {
    const lang = req.query.lang;
    const faqs = await FAQ.find({});
    res.json({ 'Total Count': faqs.length, faqs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
};

module.exports = getFAQ;
