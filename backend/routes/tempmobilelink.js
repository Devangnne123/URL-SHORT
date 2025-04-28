const express = require('express');
const router = express.Router();
const { TempMobileLink } = require('../models/tempmobilelink'); // Assuming you have this model

// Route to store matched links in tempmobilelink database
router.post('/tempmobilelink', async (req, res) => {
  const { uniqueId, matchedLinks } = req.body;

  try {
    // Assuming you have a TempMobileLink model for tempmobilelink database
    const newLink = await TempMobileLink.create({
      uniqueId,
      matchedLinks,
    });
    res.status(200).json({ message: 'Matched links stored successfully', data: newLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error storing matched links' });
  }
});

module.exports = router;
