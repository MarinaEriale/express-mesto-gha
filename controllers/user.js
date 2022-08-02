const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const IncorrectQueryError = require('../errors/incorrect-query-err');
const NotFoundError = require('../errors/not-found-err');
const ErrorDefault = require('../errors/error-default');
const AlreadyExistsError = require('../errors/already-exists-err');

exports.getUsers = (req, res, next) => {
  userModel
    .find({}, ['name', 'about', 'avatar', '_id', 'email'])
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch(() => next(new ErrorDefault('Ошибка сервера')));
};

exports.getUserById = (req, res, next) => {
  userModel
    .findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        return next(new NotFoundError('Пользователь не был найден'));
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectQueryError('Передан не валидный id'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userModel
      .create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
      .then((user) => res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      }))
    // данные не записались, вернём ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new IncorrectQueryError('Переданы некорректные данные'));
        }
        if (err.code === 11000) {
          return next(new AlreadyExistsError('Пользователь уже существует'));
        }
        return next(new ErrorDefault('Ошибка сервера'));
      }));
};

exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(
      userId,
      { name: req.body.name, about: req.body.about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true,
      },
    )
    .then((user) => {
      if (user === null) {
        return next(new NotFoundError('Пользователь не был найден'));
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectQueryError('Переданы некорректные данные'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};

exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // запуск проверки по схеме
      },
    )
    .then((user) => {
      if (user === null) {
        return next(new NotFoundError('Пользователь не был найден'));
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectQueryError('Переданы некорректные данные'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );

      // вернём токен
      res.status(200).send({ token });
    })
    .catch(next);
};

exports.getMeEndpoint = (req, res, next) => {
  const userId = req.user._id;

  userModel
    .findById(userId)
    .then((user) => {
      if (user === null) {
        return next(new NotFoundError('Пользователь не был найден'));
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectQueryError('Передан не валидный id'));
      }
      return next(new ErrorDefault('Ошибка сервера'));
    });
};
