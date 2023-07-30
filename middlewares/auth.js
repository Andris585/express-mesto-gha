/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/UnauthorizedError');

module.exports.auth = (req, _, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new Unauthorized('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, '564560186457sdfgdfghsdt8gh423df1g2a8648652');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
