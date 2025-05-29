// controllers/linkController.js
const Link = require('../models/Links');
const axios = require('axios');

// Function to compare and update matched count for each link
const updateMatchedCount = async (uniqueId, matchedCount) => {
  try {
    await Link.update(
      { matchedCount: matchedCount },
      { where: { uniqueId: uniqueId } }
    );
  } catch (err) {
    console.error('Error updating matched count:', err);
  }
};

// Function to check if links match
const checkIfMatch = (cleanLinks, masterUrls) => {
  let matchedLinks = [];
  let notMatchedLinks = [];

  cleanLinks.forEach(cleanLink => {
    const isMatched = masterUrls.some(masterUrl => masterUrl.clean_linkedin_link === cleanLink);
    if (isMatched) {
      matchedLinks.push(cleanLink);
    } else {
      notMatchedLinks.push(cleanLink);
    }
  });

  return { matchedLinks, notMatchedLinks };
};

// Fetch links and master URLs, and update matched count
const fetchAndCompareLinks = async (req, res) => {
  try {
    const linkResponse = await axios.get('http://65.0.19.161:5000/api/links');
    const masterUrlResponse = await axios.get('http://65.0.19.161:5000/api/master-urls');

    const links = linkResponse.data;
    const masterUrls = masterUrlResponse.data;

    for (let link of links) {
      const { matchedLinks } = checkIfMatch(link.clean_links, masterUrls);
      const matchedCount = matchedLinks.length;

      // Update matched count in the database
      await updateMatchedCount(link.uniqueId, matchedCount);
    }

    res.status(200).send('Matched counts updated successfully');
  } catch (err) {
    console.error('Error fetching and comparing links:', err);
    res.status(500).send('Error fetching and comparing links');
  }
};

module.exports = { fetchAndCompareLinks };
