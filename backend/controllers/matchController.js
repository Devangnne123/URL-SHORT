// const TempMobileData = require('../models/tempMobileDataModel');

// // Function to update match status
// const updateMatchStatus = async (linkedinLinkId, isMatched, matchDetails) => {
//   try {
//     await TempMobileData.update(
//       {
//         matched: isMatched,         // Set matched status
//         match_details: matchDetails, // Optional details
//       },
//       {
//         where: { linkedin_link_id: linkedinLinkId },  // Update based on linkedin_link_id
//       }
//     );
//     console.log('Match status updated successfully');
//   } catch (error) {
//     console.error('Error updating match status:', error);
//   }
// };

// module.exports = {
//   updateMatchStatus
// };
