const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const Link = require('./models/Links'); // Import Link model
const MasterUrl = require("./models/MasterUrl"); // Import MasterUrl model
const TempMobileLink = require('./models/tempmobilelink'); // Import TempMobileLink model

const uploadRoute = require('./routes/uploadRoute');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API to fetch all Links
app.get('/api/links', async (req, res) => {
  try {
    const links = await Link.findAll(); // Fetch all links
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching links from database' });
  }
});

// API to search a Link by uniqueId
app.get('/api/links/search/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const link = await Link.findOne({ where: { uniqueId } });

    if (link) {
      res.json(link);
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for the link' });
  }
});

// Routes

app.use('/api/upload', uploadRoute);

// API to Add Master URL
app.post("/add-master-url", async (req, res) => {
  const { linkedin_link, clean_linkedin_link, linkedin_link_remark } = req.body;

  try {
    const newMasterUrl = await MasterUrl.create({
      linkedin_link,
      clean_linkedin_link,
      linkedin_link_remark,
    });

    res.status(201).json(newMasterUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// API to fetch Master URL by ID
app.get("/master-url/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const masterUrl = await MasterUrl.findOne({
      where: { linkedin_link_id: id },
    });

    if (!masterUrl) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json(masterUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Dummy API to trigger updating Links status (optional logic later)
app.get("/update-links-status", async (req, res) => {
  // You can define your `updateLinksStatus` function separately.
  res.send("Links status updated based on Master URL links!");
});

// API endpoint to fetch all master URLs
app.get('/api/master-urls', async (req, res) => {
  try {
    const masterUrls = await MasterUrl.findAll();
    res.json(masterUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching master URLs from database' });
  }
});








// API endpoint to update matched count for a specific link by uniqueId
app.put('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  const { matchedCount } = req.body;

  try {
    const link = await Link.findOne({ where: { uniqueId: id } });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await Link.update({ matchedCount }, {
      where: { uniqueId: id },
    });

    res.status(200).json({ message: 'Match count updated successfully' });
  } catch (error) {
    console.error('Error updating match count:', error);
    res.status(500).json({ message: 'Error updating match count' });
  }
});








app.get('/api/links/search/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const link = await Link.findOne({ where: { uniqueId } });

    if (link) {
      res.json(link);
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for the link' });
  }
});








// API to store matched links into tempmobilelink table
app.post('/api/tempmobilelink', async (req, res) => {
  const { uniqueId, matchedLinks } = req.body;

  try {
    const newTempMobileLink = await TempMobileLink.create({
      uniqueId,
      matchedLinks,
    });

    res.status(201).json(newTempMobileLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error storing matched links' });
  }
});








const tempMobileLinkRoutes = require('./routes/tempmobilelinkroute');
app.use('/api/tempmobilelink', tempMobileLinkRoutes);











// Fetch and store logic
const fetchAndStoreTempMobileLinkData = async () => {
  try {
    const tempMobileLinks = await TempMobileLink.findAll();

    for (const tempLink of tempMobileLinks) {
      // Check if the uniqueId already exists in the Link table to avoid duplication
      const existingLink = await Link.findOne({ where: { uniqueId: tempLink.uniqueId } });

      if (!existingLink) {
        await Link.create({
          uniqueId: tempLink.uniqueId,
          totalLinks: tempLink.matchedLinks.length,
          links: tempLink.matchedLinks,
          mobile_numbers: tempLink.mobile_numbers || [],
          person_names: tempLink.person_names || [],
          person_locations: tempLink.person_locations || [],
          mobile_numbers_2: tempLink.mobile_numbers_2 || [],
        });
      }
    }

    console.log('TempMobileLink data moved successfully to Links table.');
  } catch (error) {
    console.error('Error moving TempMobileLink data:', error.message);
  }
};






const matchedLinksRoutes = require('./routes/matchedLinksRoutes');
// app.use(bodyParser.json());

// Use the routes
app.use('/api/matched-links', matchedLinksRoutes);

// Database Connection
connectDB();
sequelize.sync().then(() => {
  console.log('Database connected successfully.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Run fetch every 1 minute
    // setInterval(fetchAndStoreTempMobileLinkData, 60 * 1000);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});