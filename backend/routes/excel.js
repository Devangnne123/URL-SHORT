const express = require('express');
const router = express.Router();
const Link = require('../models/Links');
const TempMobileLink = require('../models/tempmobilelink');
const ExcelJS = require('exceljs');

// Download Links data + Matched Links as Excel
router.get('/download-excel', async (req, res) => {
  try {
    const links = await Link.findAll({
      include: [
        {
          model: TempMobileLink,
          as: 'tempMobileLink',
          required: false,
        }
      ]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Links Data');

    worksheet.columns = [
      { header: 'Unique ID', key: 'uniqueId', width: 40 },
      { header: 'Matched Links', key: 'matched_links', width: 50 },
      { header: 'Mobile Numbers', key: 'mobile_numbers', width: 50 },
      { header: 'Person Names', key: 'person_names', width: 40 },
      { header: 'Person Locations', key: 'person_locations', width: 40 },
      { header: 'Mobile Numbers 2', key: 'mobile_numbers_2', width: 50 },
    ];

    for (const link of links) {
      worksheet.addRow({
        uniqueId: link.uniqueId,
        matched_links: link.tempMobileLink?.matchedLinks ? link.tempMobileLink.matchedLinks.join(', ') : '',
        mobile_numbers: link.mobile_numbers ? link.mobile_numbers.join(', ') : '',
        person_names: link.person_names ? link.person_names.join(', ') : '',
        person_locations: link.person_locations ? link.person_locations.join(', ') : '',
        mobile_numbers_2: link.mobile_numbers_2 ? link.mobile_numbers_2.join(', ') : '',
      });
    }

    // Set Filename
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const filename = `links_data_with_matched_${formattedDate}.xlsx`;

    // Send Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
