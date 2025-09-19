import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';

import issuesRouter from './routes/issues.js';
import issueTypesRouter from './routes/issueTypes.js';
import localitiesRouter from './routes/localities.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import IssueType from './models/IssueType.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cityvoice';

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:8080', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Session configuration (stored in MongoDB)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/issue-types', issueTypesRouter);
app.use('/api/localities', localitiesRouter);
app.use('/api/users', usersRouter);

// Connect + seed then start
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Seed default issue types if none exist
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

    // Seed sample localities, a demo user and some issues if none exist
    const Locality = (await import('./models/Locality.js')).default;
    const User = (await import('./models/User.js')).default;
    const Issue = (await import('./models/Issue.js')).default;

    const localityCount = await Locality.estimatedDocumentCount();
    let sampleLocality;
    if (localityCount === 0) {
      sampleLocality = await Locality.create({ name: 'Central Park', city: 'Metropolis', state: 'State', country: 'Country' });
      console.log('Seeded sample locality');
    } else {
      sampleLocality = await Locality.findOne();
    }

    const userCount = await User.estimatedDocumentCount();
    let demoUser;
    if (userCount === 0) {
      demoUser = await User.create({ name: 'Demo User', email: 'demo@local.test', password: 'password', role: 'citizen', provider: 'local' });
      console.log('Seeded demo user');
    } else {
      demoUser = await User.findOne();
    }

    // Seed admin user if not present
    let adminUser = await User.findOne({ email: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({ name: 'Admin', email: 'admin', password: '12345', role: 'admin', provider: 'local' });
      console.log('Seeded admin user');
    }

    const issueCount = await Issue.estimatedDocumentCount();
    if (issueCount === 0) {
      // try to map to issueType ids
      const types = await IssueType.find().limit(5).lean();
      const typeMap = types.reduce((acc, t) => { acc[t.key] = t._id; return acc; }, {});

      await Issue.create([
        {
          title: 'Big pothole near the intersection',
          description: 'A large pothole forming at the corner, causing vehicle damage',
          location: 'Corner of 5th and Main',
          issueType: typeMap['pothole'] || undefined,
          locality: sampleLocality._id,
          reportedBy: demoUser._id,
        },
        {
          title: 'Streetlight not working',
          description: 'The streetlight has been off for several nights',
          location: 'Elm Street near block 12',
          issueType: typeMap['streetlight'] || undefined,
          locality: sampleLocality._id,
          reportedBy: demoUser._id,
        },
        {
          title: 'Overflowing garbage bin',
          description: 'Garbage bin overflow causing litter in the area',
          location: 'Park entrance',
          issueType: typeMap['garbage'] || undefined,
          locality: sampleLocality._id,
          reportedBy: demoUser._id,
        },
      ]);
      console.log('Seeded sample issues');
    }

    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });

export default app;
