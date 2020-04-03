const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const validateSignupInput = require('../../validation/signup');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');

router.post('/signup', async (req, res) => {
  const { errors, isValid } = validateSignupInput(req.body);
  const { user_name, email, password } = req.body;

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ $or: [{ email }, { user_name }] });
  if (user) {
    if (user.email === email) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      return res.status(400).json({ user_name: 'Username already exists' });
    }
  } else {
    try {
      const newUser = new User({ user_name, email, password });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      newUser.password = hashedPassword;

      const createdUser = await newUser.save();

      if (createdUser) {
        return res.json(createdUser);
      }
    } catch (error) {
      console.log({ error });
    }
  }
});

router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ email: 'Email not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const payload = {
      id: user.id,
      user_name: user.user_name
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: 3600 });

    return res.json({
      success: true,
      token: 'Bearer ' + token
    });
  } else {
    return res.status(400).json({ password: 'Password incorrect !!!' });
  }
});

module.exports = router;
