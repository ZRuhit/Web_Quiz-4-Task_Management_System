// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import nodemailer from 'nodemailer'; // For sending email
import crypto from 'crypto'; // For generating random reset token

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    console.log('Register request:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({ name, email, password }); // password will be hashed by pre-save
      await user.save();

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Registration error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      console.log('Login attempt for:', email);

      const user = await User.findOne({ email }).select('+password'); // must select password
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

// @route   POST api/auth/forgot-password
// @desc    Send password reset email
router.post('/forgot-password', 
    [check('email', 'Please include a valid email').isEmail()], 
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email } = req.body;
  
      try {
        // 1. Find user by email
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }
  
        // 2. Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpire = Date.now() + 3600000; // Token expires in 1 hour
  
        // Save the reset token and its expiration in the user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();
  
        // 3. Send email with reset token
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS // Your email password
          }
        });
  
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
  
        const mailOptions = {
          to: email,
          from: process.env.EMAIL_USER,
          subject: 'Password Reset Request',
          text: `You requested a password reset. Click the link below to reset your password:\n\n${resetURL}`
        };
  
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ errors: [{ msg: 'Email not sent' }] });
          }
          res.status(200).json({ msg: 'Password reset email sent' });
        });
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );
  
  // @route   POST api/auth/reset-password/:token
  // @desc    Reset user password
  router.post('/reset-password/:token', 
    [
      check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
    ], 
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { password } = req.body;
      const { token } = req.params;
  
      try {
        // 1. Find user by reset token
        let user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
        
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'Invalid or expired token' }] });
        }
  
        // 2. Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
  
        // Clear the reset token and expiration time
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
  
        // Save the new password
        await user.save();
  
        res.status(200).json({ msg: 'Password has been successfully reset' });
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

export default router;
