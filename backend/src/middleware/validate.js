const { ApiError } = require('../utils/http');

module.exports = schema => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(new ApiError(400, result.error.issues.map(i => i.message).join('. ')));
  req.body = result.data;
  next();
};
