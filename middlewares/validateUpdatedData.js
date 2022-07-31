const { celebrate, Joi } = require('celebrate');

const validateUpdatedUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUpdatedAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(http|https):\/\/([\w.]+\/?)\S*/),
  }),
});

module.exports = {
  validateUpdatedUser,
  validateUpdatedAvatar,
};
