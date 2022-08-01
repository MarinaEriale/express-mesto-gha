// const req = require('express/lib/request');
const cardModel = require('../models/card');
const IncorrectQueryError = require('../errors/incorrect-query-err');
const NotFoundError = require('../errors/not-found-err');
const ErrorDefault = require('../errors/error-default');
// const AuthError = require('../errors/auth-err');
const ForbiddenError = require('../errors/forbidden-err');

exports.getCards = (req, res, next) => {
  cardModel
    .find({})
    .then((card) => res.send({ data: card }))
    .catch(() => next(new ErrorDefault('Ошибка сервера')));
};

exports.deleteCard = (req, res, next) => {
  cardModel
    .findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return next(new NotFoundError('Карточка не была найдена'));
      } if (req.user._id !== String(card.owner)) {
        return next(new ForbiddenError('Нет права на удаление карточки'));
      }
      return card.remove()
        .then((deletedCard) => {
          res.status(200).send({ data: deletedCard });
        })
      // return cardModel
      //   .findByIdAndRemove(req.params.cardId)
      //   .then((deletedCard) => {
      //     res.status(200).send({ data: deletedCard });
      //   })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new IncorrectQueryError('Передан не валидный id'));
          }
          return next(new ErrorDefault('Ошибка сервера'));
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectQueryError('Передан не валидный id'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  // получим из объекта запроса название и адрес ссылки на картинку карточки
  const ownerId = req.user._id;

  cardModel
    .create({ name, link, owner: ownerId }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((card) => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: {
        _id: ownerId,
      },
      _id: card._id,
    }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectQueryError('Переданы некорректные данные'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};

module.exports.likeCard = (req, res, next) => {
  const ownerId = req.user._id;
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (card === null) {
        return next(new NotFoundError('Карточка не была найдена'));
      }
      return res.send({
        createdAt: card.createdAt,
        likes: card.likes,
        link: card.link,
        name: card.name,
        owner: {
          _id: ownerId,
        },
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectQueryError('Переданы некорректные данные'));
      }
      if (err.name === 'CastError') {
        return next(new IncorrectQueryError('Передан не валидный id'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const ownerId = req.user._id;
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => {
      if (card === null) {
        return next(new NotFoundError('Карточка не была найдена'));
      }
      return res.send({
        createdAt: card.createdAt,
        likes: card.likes,
        link: card.link,
        name: card.name,
        owner: {
          _id: ownerId,
        },
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectQueryError('Переданы некорректные данные'));
      }
      if (err.name === 'CastError') {
        return next(new IncorrectQueryError('Передан не валидный id'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};
