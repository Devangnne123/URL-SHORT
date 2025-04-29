const express = require('express');
const router = express.Router();
const TempMobileLink = require('../models/tempmobilelink'); // Assuming you have this model

// API to store matched links into tempmobilelink table
router.post('/api/tempmobilelink', async (req, res) => {
  const {
    uniqueId,
    matchedLinks,
    mobile_number,
    person_name,
    person_location,
    mobile_number_2,
  } = req.body;

  try {
    const newTempMobileLink = await TempMobileLink.create({
      uniqueId,
      matchedLinks,
      mobile_number,
      person_name,
      person_location,
      mobile_number_2,
    });

    res.status(201).json(newTempMobileLink);
  } catch (error) {
    console.error('Error storing temp mobile link:', error);
    res.status(500).json({ message: 'Error storing temp mobile link' });
  }
});


module.exports = router;
