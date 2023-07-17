/* eslint-disable no-unused-vars */
const Card = require("../models/card");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getCards = (_, res) => {
  Card.find({})
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена" });
      }
      return res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для удаления карточки',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
