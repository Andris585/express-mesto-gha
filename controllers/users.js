/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { OK, CREATED } = require('../utils/errors');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '564560186457sdfgdfghsdt8gh423df1g2a8648652', {
        expiresIn: '7d',
      });

      res.cookie('token', token, { maxAge: 3600000, httpOnly: true }).status(OK).send({ message: 'Вы авторизовались' });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному _id не найден');
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFound('Пользователь по указанному _id не найден'));
      }
      return next(err);
    });
};

module.exports.createNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};
