// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);     // Main features under /api

app.get('/', (req, res) => {
  res.send(`
    <h1>🏠 Apartment Maintenance & Billing Portal</h1>
    <p>Backend Running Successfully!</p>
  `);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});