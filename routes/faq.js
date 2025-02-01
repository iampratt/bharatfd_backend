const express = require('express');
const getFAQ = require('../controllers/getFAQ');
const createFAQ = require('../controllers/createFAQ');
const updateFAQ = require('../controllers/updateFAQ');
const deleteFAQ = require('../controllers/deleteFAQ');

const router = express.Router();

router.get('/faqs', getFAQ);
router.post('/createFAQ', createFAQ);
router.post('/updateFAQ/:id', updateFAQ);
router.post('/deleteFAQ/:id', deleteFAQ);

module.exports = router;
