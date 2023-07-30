const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cards');
const {
  createCardValidation,
  deleteCardValidation,
  addLikeValidation,
  removeLikeValidation,
} = require('../utils/validation');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCardValidation, createCard);
cardsRouter.delete('/cards/:cardId', deleteCardValidation, deleteCard);
cardsRouter.put('/cards/:cardId/likes', addLikeValidation, addLike);
cardsRouter.delete('/cards/:cardId/likes', removeLikeValidation, removeLike);

module.exports = cardsRouter;
