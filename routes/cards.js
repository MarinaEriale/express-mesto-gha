const express = require("express");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const cardRouter = require("express").Router();

cardRouter.get("/cards", getCards);

cardRouter.post("/cards", express.json(), createCard);

cardRouter.delete("/cards/:cardId", deleteCard);

cardRouter.put("/cards/:cardId/likes", likeCard);

cardRouter.delete("/cards/:cardId/likes", dislikeCard);

module.exports = cardRouter;
