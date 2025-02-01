const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  lang: { type: String, required: true },
  question: { type: String },
  answer: { type: String },
});

const faqSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    translations: [translationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
