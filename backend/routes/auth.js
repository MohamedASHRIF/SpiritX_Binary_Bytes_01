const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();


const validatePassword = (password) => {
  const regexLowercase = /[a-z]/;
  const regexUppercase = /[A-Z]/;
  const regexSpecialChar = /[\d\W]/;
  return regexLowercase.test(password) && regexUppercase.test(password) && regexSpecialChar.test(password);
};


router.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character.' });
  }

  try {
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    
    const user = new User({ username, password });

    await user.save();
    res.status(201).json({ message: 'Signup successful! Please login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/check-username', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.json({ isUnique: false });
    }
    return res.json({ isUnique: true });
  } catch (err) {
    return res.status(500).json({ message: "Error checking username." });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token, message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
