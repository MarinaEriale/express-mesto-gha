const req = require("express/lib/request");
const { default: mongoose } = require("mongoose");
const cardModel = require("../models/card");
const user = require("../models/user");

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

exports.getCards = (req, res) => {
  cardModel
    .find({})
    .populate("owner")
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({ message: `Ошибка ${err} Переданы некорректные данные` });
      } else if (err.name === "CastError") {
        res.status(ERROR_NOT_FOUND).send({
          message: `Ошибка ${err} Запрашиваемый ресурс не был найден`,
        });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: `Ошибка ${err} Ошибка по умолчанию` });
      }
    });
};

exports.deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body; // получим из объекта запроса название и адрес ссылки на картинку карточки
  const ownerId = req.user._id;

  cardModel
    .create({ name, link, owner: ownerId }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((card) =>
      res.send({
        createdAt: card.createdAt,
        likes: card.likes,
        link: card.link,
        name: card.name,
        owner: {
          _id: ownerId,
        },
        _id: card._id,
      })
    )
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({ message: `Ошибка ${err} Переданы некорректные данные` });
      } else if (err.name === "CastError") {
        res.status(ERROR_NOT_FOUND).send({
          message: `Ошибка ${err} Запрашиваемый ресурс не был найден`,
        });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: `Ошибка ${err} Ошибка по умолчанию` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .then((card) =>
      res.send({
        createdAt: card.createdAt,
        likes: card.likes,
        link: card.link,
        name: card.name,
        owner: {
          _id: ownerId,
        },
        _id: card._id,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({ message: `Ошибка ${err} Переданы некорректные данные` });
      } else if (err.name === "CastError") {
        res.status(ERROR_NOT_FOUND).send({
          message: `Ошибка ${err} Запрашиваемый ресурс не был найден`,
        });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: `Ошибка ${err} Ошибка по умолчанию` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    )
    .then((card) => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: {
        _id: ownerId
      },
      _id: card._id
     }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({ message: `Ошибка ${err} Переданы некорректные данные` });
      } else if (err.name === "CastError") {
        res.status(ERROR_NOT_FOUND).send({
          message: `Ошибка ${err} Запрашиваемый ресурс не был найден`,
        });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: `Ошибка ${err} Ошибка по умолчанию` });
      }
    });
};

