// const xlsx = require('xlsx');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const UploadedLink = require('../model/uploadedLinks'); // Make sure this model exists

// const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded.' });
//     }

//     const filePath = req.file.path;

//     // Read the Excel file
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     const links = data
//       .map(row => row.Link || row.link || '') // Handle 'Link' or 'link'
//       .filter(link => link !== '');

//     if (links.length === 0) {
//       fs.unlinkSync(filePath);
//       return res.status(400).json({ error: 'No valid links found in the uploaded file.' });
//     }

//     // Generate a Unique ID
//     const uniqueId = uuidv4();

//     // Save to MongoDB
//     const uploadedLink = new UploadedLink({
//       uniqueId,
//       links,
//     });
//     await uploadedLink.save();

//     // Delete the uploaded file after processing
//     fs.unlinkSync(filePath);

//     // Respond back to the client
//     res.status(200).json({
//       message: 'File uploaded and links saved successfully!',
//       uniqueId,
//       totalLinks: links.length,
//       links,
//     });

//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ error: 'Failed to upload and process the file.' });
//   }
// };

// module.exports = {
//   uploadFile,
// };
