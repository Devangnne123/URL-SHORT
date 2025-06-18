const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');
const User = require('./models/User'); // your User model


const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // ✅ Connect to PostgreSQL

app.use('/api', authRoutes);

const excelRoutes = require('./routes/excels');
app.use('/api/excel', excelRoutes);




app.get('/api/user/key', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ key: user.key });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user key' });
  }
});



// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { key } = req.body;
  const user = await User.findOne({ where: { key } });

  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});








  // Refresh key by email
app.post('/api/user/refresh-key', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newKey = user.generateKey();
    await user.save();

    return res.json({ message: 'Key refreshed successfully', newKey });
  } catch (err) {
    console.error('Error refreshing key:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
