const express = require('express');
const router = express.Router();
const TempMobileLink = require('../models/tempmobilelink');
const Link = require('../models/Links'); // Import Link model

// Fetch matched links and existing data
router.get('/:uniqueId', async (req, res) => {
  try {
    const tempMobileLink = await TempMobileLink.findOne({ where: { uniqueId: req.params.uniqueId } });
    if (!tempMobileLink) {
      return res.status(404).json({ message: 'TempMobileLink not found' });
    }

    res.json({
      matchedLinks: tempMobileLink.matchedLinks || [],
      mobile_numbers: tempMobileLink.mobile_numbers || [],
      person_names: tempMobileLink.person_names || [],
      person_locations: tempMobileLink.person_locations || [],
      mobile_numbers_2: tempMobileLink.mobile_numbers_2 || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit and Update details in TempMobileLink + Link
router.post('/:uniqueId/update-details', async (req, res) => {
  try {
    const { mobile_numbers, person_names, person_locations, mobile_numbers_2 } = req.body;

    const tempMobileLink = await TempMobileLink.findOne({ where: { uniqueId: req.params.uniqueId } });
    if (!tempMobileLink) {
      return res.status(404).json({ message: 'TempMobileLink not found' });
    }

    const matchedLinksCount = tempMobileLink.matchedLinks?.length || 0;

    if (
      mobile_numbers.length !== matchedLinksCount ||
      person_names.length !== matchedLinksCount ||
      person_locations.length !== matchedLinksCount ||
      mobile_numbers_2.length !== matchedLinksCount
    ) {
      return res.status(400).json({ message: `Data count mismatch! Expected ${matchedLinksCount} entries for each field.` });
    }

    // Step 1: Update TempMobileLink
    tempMobileLink.mobile_numbers = mobile_numbers;
    tempMobileLink.person_names = person_names;
    tempMobileLink.person_locations = person_locations;
    tempMobileLink.mobile_numbers_2 = mobile_numbers_2;
    await tempMobileLink.save();

    // Step 2: Update Link table also
    const link = await Link.findOne({ where: { uniqueId: req.params.uniqueId } });
    if (link) {
      link.mobile_numbers = mobile_numbers;
      link.person_names = person_names;
      link.person_locations = person_locations;
      link.mobile_numbers_2 = mobile_numbers_2;
      await link.save();
    }

    res.json({ message: 'Details updated successfully in TempMobileLink and Link!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
