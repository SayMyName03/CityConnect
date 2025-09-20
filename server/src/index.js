import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import issuesRoutes from './routes/issues.js';
import issueTypesRoutes from './routes/issueTypes.js';
import localitiesRoutes from './routes/localities.js';
import chatbotRouter from './routes/chatbot.js';
import IssueType from './models/IssueType.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:8080', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session (used by passport if needed)
app.use(session({
  secret: process.env.SESSION_SECRET || 'cityconnect-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon' }),
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/issue-types', issueTypesRoutes);
app.use('/api/localities', localitiesRoutes);
app.use('/api/chatbot', chatbotRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.json({ message: 'Authentication API Server' }));

// Start server helper
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(`Auth endpoints: http://localhost:${PORT}/api/auth`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
};

// Connect to DB then start
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Lightweight seeding of issue types
    try {
      const count = await IssueType.estimatedDocumentCount();
      if (count === 0) {
        await IssueType.insertMany([
          { key: 'waste-management', label: 'Waste Management' },
          { key: 'water-issues', label: 'Water Issues' },
          { key: 'air-quality', label: 'Air Quality & Pollution' },
        ]);
        console.log('Seeded default issue types');
      }
    } catch (err) {
      console.warn('Seeding issue types skipped:', err.message);
    }

    startServer();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  process.exit(0);
});

connectDB();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import issuesRoutes from './routes/issues.js';
import issueTypesRoutes from './routes/issueTypes.js';
import localitiesRoutes from './routes/localities.js';
import chatbotRouter from './routes/chatbot.js';
import IssueType from './models/IssueType.js';

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Essential Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session (optional, used by some passport strategies)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'cityconnect-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon' }),
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/issue-types', issueTypesRoutes);
app.use('/api/localities', localitiesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRouter);

// MongoDB Connection with error handling and lightweight seeding
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon';
    console.log('Connecting to MongoDB:', mongoURI);
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connected successfully');

    // Seed default issue types if none exist
    try {
      const count = await IssueType.estimatedDocumentCount();
      if (count === 0) {
        await IssueType.insertMany([
          { key: 'waste-management', label: 'Waste Management' },
          { key: 'water-issues', label: 'Water Issues' },
          { key: 'air-quality', label: 'Air Quality & Pollution' },
          { key: 'road-traffic', label: 'Road & Traffic' },
          { key: 'public-transport', label: 'Public Transport' },
          { key: 'street-lighting', label: 'Street Lighting & Safety' },
          { key: 'green-spaces', label: 'Green Spaces' },
          { key: 'flooding', label: 'Flooding / Waterlogging' },
          { key: 'energy-issues', label: 'Energy Issues' },
          { key: 'other', label: 'Other / Misc' },
        ]);
        console.log('Seeded default issue types');
      }
    } catch (seedErr) {
      console.warn('Issue type seeding skipped/failed:', seedErr.message);
    }

    // Start server after DB connection and optional seeding
    startServer();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};
// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon';
    console.log('Connecting to MongoDB:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Connect to database before starting server
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Mount issue-related APIs so the frontend can list/create/update issues
app.use('/api/issues', issuesRoutes);
app.use('/api/issue-types', issueTypesRoutes);
app.use('/api/localities', localitiesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Authentication API Server' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
  });
});

// Handle 404s
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with better error handling
const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      console.log('🚀 Server started successfully');
      console.log(`📍 API listening on: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('Try a different port or kill the process using this port');
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(1);
  }
};

// Start the server
startServer();

// Connect to database before starting server
connectDB();
startServer();

// Connect to database before starting server
connectDB();
