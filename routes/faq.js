const express = require('express');
const getFAQ = require('../controllers/getFAQ');
const createFAQ = require('../controllers/createFAQ');
const updateFAQ = require('../controllers/updateFAQ');

const router = express.Router();

router.get('/faqs', getFAQ);
router.post('/createFAQ', createFAQ);
router.post('/updateFAQ/:id', updateFAQ);

module.exports = router;
