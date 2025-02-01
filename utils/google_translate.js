const model = require('../config/gemini');

const translateLanguage = async (text, lang = 'en') => {
  const prompt = `translate and only give text in lang="${lang}", text= "${text}"`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
const detectLanguage = async (text) => {
  const prompt = `detect language and only tell me language code, text="${text}"`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { translateLanguage, detectLanguage };
