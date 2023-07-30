/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const { OK, CREATED } = require('../utils/errors');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (_, res, next) => {
  Card.find({})
    .then((card) => res.status(OK).send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка с указанным _id не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new Forbidden('Нельзя удалять чужие посты'));
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequest('Переданы некорректные данные при удалении карточки'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Передан несуществующий _id карточки'));
      }
      return res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Передан несуществующий _id карточки'));
      }
      return res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};
