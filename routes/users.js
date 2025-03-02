// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users sorted by highScore
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ highScore: -1 })
      .select('username highScore')
      .limit(10);
    
    console.log('Leaderboard data:', users);
    res.json(users);
  } catch (error) {
    console.error('Error in leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard data
router.get('/leaderboard', async (req, res) => {
  try {
    console.log('Leaderboard endpoint called');
    
    // First check how many users exist total
    const totalUsers = await User.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);
    
    // Then try to find users with highScore
    const users = await User.find({})
      .sort({ highScore: -1 })
      .select('username highScore')
      .limit(10);
    
    console.log('Leaderboard results:', users);
    console.log('Number of users found:', users.length);
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Add this as an alternative endpoint

// Get all users (unfiltered, unsorted)
router.get('/all-users', async (req, res) => {
  try {
    console.log('All users endpoint called');
    const users = await User.find({});
    console.log('All users count:', users.length);
    console.log('First few users:', users.slice(0, 3));
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Failed to fetch all users' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, highScore: 0 });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register a user or return existing user data
router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, highScore: 0, recentScores: [] });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD BACK THE USERNAME ROUTE - but AFTER the /leaderboard route
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user score route (if you have one)
router.put('/:username/score', async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update high score if new score is higher
    if (score > user.highScore) {
      user.highScore = score;
    }
    
    // Add to recent scores array
    if (user.recentScores) {
      user.recentScores.push(score);
      // Keep only the last 10 scores
      if (user.recentScores.length > 10) {
        user.recentScores.shift();
      }
    } else {
      user.recentScores = [score];
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// You can keep the /all route as an alternative if you want
// But we already have /leaderboard that does the same thing

module.exports = router;