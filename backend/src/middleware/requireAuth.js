const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { ApiError } = require('../utils/http');

module.exports = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  try {
    if (scheme !== 'Bearer' || !token) throw new Error('missing token');
    req.userId = jwt.verify(token, JWT_SECRET).id;
    next();
  } catch {
    next(new ApiError(401, 'Please log in'));
  }
};
