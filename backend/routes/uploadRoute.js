const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const Link = require('../models/Links'); // Link model
const MasterUrl = require('../models/MasterUrl'); // MasterUrl model

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Read uploaded file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Extract LinkedIn links
    const links = data.flat().filter(link => typeof link === 'string' && link.includes('linkedin.com'));

    if (links.length === 0) {
      return res.status(400).json({ message: 'No valid LinkedIn links found.' });
    }

    // Clean links
    const cleanedLinks = links.map(link => {
      let cleanedLink = link.replace('Linkedin.Com/In/', 'linkedin.com/in/')
                             .replace('linkedin.com//in/', 'linkedin.com/in/')
                             .toLowerCase();
      return cleanedLink;
    });

    // Remarks
    const remarks = links.map(link => {
      if (link.includes('linkedin.com/in/')) {
        return 'ok';
      }
      return 'invalid';
    });

    // Fetch all master clean links
    const masterUrls = await MasterUrl.findAll({
      attributes: ['clean_linkedin_link'],
    });

    const masterCleanLinks = masterUrls.map(url => url.clean_linkedin_link);

    // Compare cleaned links with master links
    const isMatchFound = cleanedLinks.some(cleanedLink => masterCleanLinks.includes(cleanedLink));

    // Save to database
    const savedLink = await Link.create({
      uniqueId: uuidv4(),
      totalLinks: links.length,
      links: links,               // Original links
      clean_links: cleanedLinks,   // Cleaned links
      remark: remarks.join(', '),  // Remarks
      status: isMatchFound,        // True if match found, else false

    });

    res.json({
      message: 'File uploaded and links saved successfully!',
      savedLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


const { fetchAndCompareLinks } = require('../controllers/matchedcount');

// Route to trigger matching and updating matched count
router.get('/compare-links', fetchAndCompareLinks);

module.exports = router;
