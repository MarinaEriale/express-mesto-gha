const express = require('express');
const cardRouter = require('express').Router();

const validateCard = require('../middlewares/validateCard');
const validateCardId = require('../middlewares/validateCardId');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', express.json(), validateCard, createCard);

cardRouter.delete('/cards/:cardId', validateCardId, deleteCard);

cardRouter.put('/cards/:cardId/likes', likeCard);

cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
