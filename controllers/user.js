const { default: mongoose } = require("mongoose");
const userModel = require("../models/user");

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

exports.getUsers = (req, res) => {
  userModel
    .find({})
    .then((user) => res.send({ data: user }))
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

exports.getUserById = (req, res) => {
  userModel
    .findById(req.params.userId)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
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

// exports.getUserById = getUserById;

// exports.getMeEndpoint = (req, res) => {
// req.params.userId = req.user._id;
//   getUserById(req, res)
// }

exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя

  userModel
    .create({ name, about, avatar }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
     }))
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

exports.updateProfile = (req, res) => {
  req.params.userId = req.user._id;
  userModel
    .findByIdAndUpdate(
      req.params.userId,
      { name: req.body.name, about: req.body.about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
      }
    )
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
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

exports.updateAvatar = (req, res) => {
  req.params.userId = req.user._id;
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(
      req.params.userId,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
      }
    )
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id
       });
    })
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
