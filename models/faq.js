const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
      en: { type: String },
      hi: { type: String },
      ja: { type: String },
      es: { type: String },
      fr: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
