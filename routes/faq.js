const express = require('express');
const getFAQ = require('../controllers/getFAQ');
const createFAQ = require('../controllers/createFAQ');

const router = express.Router();

router.get('/faqs', getFAQ);
router.post('/createFAQ', createFAQ);

module.exports = router;
