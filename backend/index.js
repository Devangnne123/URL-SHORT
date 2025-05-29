const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // ✅ Connect to PostgreSQL

app.use('/api', authRoutes);

const excelRoutes = require('./routes/excels');
app.use('/api/excel', excelRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
