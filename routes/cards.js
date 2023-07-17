const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:_id', deleteCard);
cardsRouter.put('/cards/:_id/likes', addLike);
cardsRouter.delete('/cards/:_id/likes', removeLike);

module.exports = cardsRouter;
