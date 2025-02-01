const express = require('express');
const dotenv = require('dotenv').config();
const db = require('./config/db');
const redis = require('./config/redis');
const gemini = require('./config/gemini');

const app = express();

const faqRoutes = require('./routes/faq');
const faq = require('./models/faq');

PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const faqs = await faq.find({});
  res.render('index', { faqs });
});
app.use('/api', faqRoutes);

app.listen(PORT || 5000, () => {
  console.log(`Server is running on port ${PORT}`);
});
