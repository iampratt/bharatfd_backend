const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

const translateText = async (text, targetLang) => {
  try {
    let [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    console.error('Translation Error:', error);
    return text;
  }
};

module.exports = { translateText };
