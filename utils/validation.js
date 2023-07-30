/* eslint-disable import/no-extraneous-dependencies */

const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const regEx = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const createNewUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regEx),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regEx).required(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(regEx).required(),
  }),
});

const deleteCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const addLikeValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const removeLikeValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  loginValidation,
  createNewUserValidation,
  getUserByIdValidation,
  updateUserValidation,
  updateUserAvatarValidation,
  createCardValidation,
  deleteCardValidation,
  addLikeValidation,
  removeLikeValidation,
};
