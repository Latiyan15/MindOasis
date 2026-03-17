const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', apiRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MindOasis backend is running' });
});

// Database & Server Startup
const startServer = async () => {
  let mongoUri = process.env.MONGODB_URI;

  // Use embedded MongoDB if no external URI provided
  if (!mongoUri) {
    try {
      if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
        console.log('Created local /data directory for persistent database storage.');
      }
      
      const mongod = await MongoMemoryServer.create({
        instance: {
          dbPath: './data',
          storageEngine: 'wiredTiger' // Required for persistence
        }
      });
      mongoUri = mongod.getUri();
      console.log('Started Embedded MongoDB Instance');
    } catch (err) {
      console.error('Failed to start Embedded MongoDB', err.message);
      // Fallback to proxy-only mode if DB fails
      mongoUri = null;
    }
  }

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log(`Connected to MongoDB: ${mongoUri}`);
    } catch (err) {
      console.error('Failed to connect to MongoDB. Server running in proxy-only mode.', err.message);
    }
  } else {
    console.log('No MongoDB connection. Server running in proxy-only mode.');
  }

  // Start Server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
