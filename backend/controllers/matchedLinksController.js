const { fetchAndStoreMatchedLinks } = require('../services/matchedLinksService');

const updateMatchedLinks = async (req, res) => {
  try {
    await fetchAndStoreMatchedLinks();
    res.status(200).send('Matched links updated successfully.');
  } catch (error) {
    console.error('Update Matched Links Error:', error);
    res.status(500).send('Error updating matched links.');
  }
};

module.exports = { updateMatchedLinks };
