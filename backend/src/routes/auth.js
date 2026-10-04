const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { User } = require('../models');
const config = require('../config');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');
const { ApiError, asyncHandler } = require('../utils/http');

const registerBody = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email: z.string().trim().email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});
const loginBody = z.object({ email: z.string().trim().email('A valid email is required'), password: z.string().min(1, 'Password is required') });

const session = user => ({
  token: jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' }),
  user: user.toJSON(),
});

router.post('/register', validate(registerBody), asyncHandler(async (req, res) => {
  res.status(201).json(session(await User.create(req.body)));
}));

router.post('/login', validate(loginBody), asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
  if (!user || !(await user.verifyPassword(req.body.password))) throw new ApiError(401, 'Invalid credentials');
  res.json(session(user));
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(401, 'Please log in');
  res.json(user);
}));

module.exports = router;
