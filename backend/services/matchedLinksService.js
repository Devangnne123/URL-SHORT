const Link = require('../models/Links'); // Assuming Link is your main model
const TempMobileLink = require('../models/tempmobilelink'); // Import TempMobileLink model // Assuming TempMobileLink is your temporary model

// Function to fetch data from TempMobileLink table and store it in the Link table
const fetchAndStoreMatchedLinks = async () => {
  try {
    // Fetch all records from the TempMobileLink table where matched links are stored
    const tempLinks = await TempMobileLink.findAll();

    // Loop through each temp record and update the corresponding Link record in the links table
    for (const tempLink of tempLinks) {
      const { uniqueId, matchedLinks } = tempLink;

      // Find the corresponding Link in the 'links' table using uniqueId
      const link = await Link.findOne({
        where: { uniqueId }
      });

      if (link) {
        // Update the matched links in the 'links' table
        link.matched_links = matchedLinks; // Assuming matchedLinks is an array in the temp table
        link.matchedCount = matchedLinks.length; // Update matched count based on matched links length

        // Save the updated record back to the 'links' table
        await link.save();
        console.log(`Matched links for Unique ID ${uniqueId} have been updated.`);
      } else {
        console.log(`No matching link found for Unique ID ${uniqueId}`);
      }
    }

    console.log('Matched links have been successfully stored in the links table.');
  } catch (error) {
    console.error('Error fetching and storing matched links:', error);
  }
};

module.exports = { fetchAndStoreMatchedLinks };
