const express = require('express');
const { updateMatchedLinks } = require('../controllers/matchedLinksController');

const router = express.Router();

router.post('/update-matched-links', updateMatchedLinks);

module.exports = router;
