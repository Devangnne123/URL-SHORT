const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const ExcelData = require('../models/ExcelData');

// File upload config
const upload = multer({ storage: multer.memoryStorage() });

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const records = data.map(row => ({
      linkedin_id: row.linkedin_id,
      person_name: row.person_name,
      mobile_number: row.mobile_number,
      mobile_number_2: row.mobile_number_2,
      person_location: row.person_location,
      linkedin_url: row.linkedin_url,
    }));

    await ExcelData.bulkCreate(records, { ignoreDuplicates: true });
    res.status(200).json({ message: 'Excel data saved successfully!' });
  } catch (err) {
    console.error('Error uploading Excel:', err);
    res.status(500).json({ message: 'Failed to upload Excel file' });
  }
});

router.get('/search/:searchId', async (req, res) => {
  try {
    const record = await ExcelData.findOne({ 
      where: { 
        linkedin_id: req.params.searchId 
      } 
    });
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'Record not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


module.exports = router;
