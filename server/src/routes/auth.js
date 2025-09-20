import express from 'express';
import User from '../models/User.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

// Regular login
router.post('/login', async (req, res) => {
  try {
    const { login, password, role } = req.body; // 'login' can be email or username

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Access denied. ${role} role required.` });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password, role = 'citizen' } = req.body;

    // Validate required fields
    if (!username || !name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists by email or username
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Create user
    const user = await User.create({
      username,
      name,
      email,
      password,
      role,
      provider: 'local',
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth
router.get('/google', (req, res, next) => {
  const { role } = req.query;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: role || 'citizen', // Pass role in state
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const role = req.query.state || 'citizen';

      // Update role if specified and user is new
      if (role === 'admin' && user.role === 'citizen') {
        user.role = 'admin';
        await user.save();
      }

      const token = generateToken(user._id);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/callback?token=${token}&role=${user.role}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/login?error=auth_failed`);
    }
  }
);

// Get current user
router.get('/me', verifyToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profilePicture: req.user.profilePicture,
    },
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;