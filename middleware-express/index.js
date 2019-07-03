const jwt = require('jsonwebtoken');

const attachUserToContext = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next()
  }
  next()
};

module.exports = { attachUserToContext };
