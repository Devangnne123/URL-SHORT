const cron = require('node-cron');
const TempMobileLink = require('../models/tempmobilelink');
const Link = require('../models/Links');

// Run every 1 minute
cron.schedule('*/1 * * * *', async () => {
  console.log('Running cron job: Updating links from TempMobileLink');

  try {
    const tempLinks = await TempMobileLink.findAll();

    for (const temp of tempLinks) {
      const existingLink = await Link.findOne({ where: { uniqueId: temp.uniqueId } });

      if (existingLink) {
        existingLink.mobile_numbers = temp.mobile_numbers || [];
        existingLink.person_names = temp.person_names || [];
        existingLink.person_locations = temp.person_locations || [];
        existingLink.mobile_numbers_2 = temp.mobile_numbers_2 || [];
        await existingLink.save();
        console.log(`Updated link with uniqueId ${temp.uniqueId}`);
      }
    }
  } catch (error) {
    console.error('Error updating links from TempMobileLink:', error);
  }
});
