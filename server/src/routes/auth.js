import express from 'express';
import User from '../models/User.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { ...req.body, password: '[REDACTED]' });
    const { username, name, email, password, role = 'citizen' } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) return res.status(400).json({ error: 'Email already exists' });
      if (existingUser.username === username) return res.status(400).json({ error: 'Username already exists' });
    }

    const user = await User.create({ username, name, email, password, role, provider: 'local' });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Login (email or username)
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { login: req.body.login || req.body.email, role: req.body.role });
    const { login, password, role } = req.body;

    if (!login || !password) return res.status(400).json({ error: 'Login and password are required' });

    const user = await User.findOne({ $or: [{ email: login }, { username: login }] });
    if (!user) return res.status(401).json({ error: 'Invalid login or password' });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).json({ error: 'Invalid login or password' });

    if (role && user.role !== role) return res.status(403).json({ error: `Access denied. ${role} role required.` });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Google OAuth start
router.get('/google', (req, res, next) => {
  const { role } = req.query;
  passport.authenticate('google', { scope: ['profile', 'email'], state: role || 'citizen' })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const role = req.query.state || 'citizen';
    if (role === 'admin' && user.role === 'citizen') {
      user.role = 'admin';
      await user.save();
    }
    const token = generateToken(user._id);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/callback?token=${token}&role=${user.role}`);
  } catch (err) {
    console.error('Google callback error:', err);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/login?error=auth_failed`);
  }
});

// Current user
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, name: req.user.name, email: req.user.email, role: req.user.role, profilePicture: req.user.profilePicture } });
});

// Logout
router.post('/logout', (req, res) => res.json({ message: 'Logged out successfully' }));

export default router;
// Register endpoint with detailed error logging
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { ...req.body, password: '[REDACTED]' });
    
    const { name, email, password, role = 'citizen' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
>>>>>>> 700eb40 (updated one)
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

    console.log('User registered successfully:', user.email);

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
  } catch (err) {
    console.error('Google callback error:', err);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/login?error=auth_failed`);
  }
});
// Login endpoint with detailed error logging
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email, role: req.body.role });
    
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check role if specified
    if (role && user.role !== role) {
      console.log('Role mismatch:', { expected: role, actual: user.role });
      return res.status(403).json({ error: `Access denied. ${role} role required.` });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('Login successful:', user.email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Login error:', error); // Critical: Log actual error
    res.status(500).json({ error: 'Login failed: ' + error.message });
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