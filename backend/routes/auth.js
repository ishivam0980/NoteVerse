import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'noteverse-super-secret-key-2025'

//ROUTE 1 : Register a new user using POST /api/auth/register. No Login required
router.post('/register', [
  // Custom name validation
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .custom((value) => {
      // Custom rule: No numbers allowed
      if (/\d/.test(value)) {
        throw new Error('Name cannot contain numbers');
      }
      return true;
    })
    .trim(),
  
  // Custom email validation
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (email) => {
      // Check if email already exists (async validation)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    })
    .normalizeEmail(),
  
  // Custom password validation
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom((value) => {
      // // Must contain at least one underscore
      // if (!value.includes('_')) {
      //   throw new Error('Password must contain at least one underscore (_)');
      // }
      
      // // Must contain at least one uppercase letter
      // if (!/[A-Z]/.test(value)) {
      //   throw new Error('Password must contain at least one uppercase letter');
      // }
      
      // // Must contain at least one lowercase letter
      // if (!/[a-z]/.test(value)) {
      //   throw new Error('Password must contain at least one lowercase letter');
      // }
      
      // // Must contain at least one number
      // if (!/\d/.test(value)) {
      //   throw new Error('Password must contain at least one number');
      // }
      
      // Must contain at least one special character (!@#$%^&*_)
      if (!/[!@#$%^&*_]/.test(value)) {
        throw new Error('Password must contain at least one special character (!@#$%^&*_)');
      }
      
      // Cannot contain common words
      const commonWords = ['password', '123456', 'admin', 'user'];
      const lowerValue = value.toLowerCase();
      if (commonWords.some(word => lowerValue.includes(word))) {
        throw new Error('Password cannot contain common words like "password", "123456", etc.');
      }
      
      return true;
    })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    // Hash the password with bcrypt
    const saltRounds = 12; // Higher = more secure but slower
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword  // Store hashed password, not plain text
    });

    const savedUser = await newUser.save();
    // Create JWT token for the new user
    const token = jwt.sign(
      {
        userId: savedUser._id,
        email: savedUser.email,
        name: savedUser.name
      },    
      JWT_SECRET,
      { expiresIn: '7d' }  // Token expires in 7 days
    );

    res.status(201).json({
      message: 'User created successfully',
      token:token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// ROUTE 2 : Login a user using POST /api/auth/login.
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // Create JWT token for logged in user
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }  // Token expires in 7 days
    );

    res.json({
      message: 'Login successful',
      token:token
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: 'Internal Server error',
      error: error.message
    });
  }
});


//ROUTE 3 : Get logged in user details using GET /api/auth/user. Login required
router.get('/user', authenticateToken, async (req, res) => {
    try {
        // Find user by ID from the token
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password field //we stored userId, email, name in token. Using userId from token to find user in DB
        if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
        }
    
        res.json({
        message: 'User details fetched successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
        message: 'Server error',
        error: error.message
        });
    }
    }
);

export default router;