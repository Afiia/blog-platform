const config = require('../config');

// Single place that turns any thrown error into a consistent JSON response.
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  if (err.code === 11000) { status = 409; message = 'Email already registered'; }
  else if (err.name === 'ValidationError') status = 400;
  else if (err.name === 'CastError') { status = 400; message = 'Invalid id'; }
  else if (err.type === 'entity.parse.failed') { status = 400; message = 'Malformed JSON'; }

  if (status >= 500) {
    console.error(err);
    if (config.NODE_ENV === 'production') message = 'Internal server error';
  }
  res.status(status).json({ message });
};
