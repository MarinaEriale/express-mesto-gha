const express = require('express');
const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  // createUser,
  updateProfile,
  updateAvatar,
  getMeEndpoint,
} = require('../controllers/user');

const { validateUpdatedUser, validateUpdatedAvatar } = require('../middlewares/validateUpdatedData');
const validateUserId = require('../middlewares/validateUserId');

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getMeEndpoint);

userRouter.get('/users/:userId', validateUserId, getUserById);

// userRouter.post('/users', express.json(), createUser);

userRouter.patch('/users/me', express.json(), validateUpdatedUser, updateProfile);

userRouter.patch('/users/me/avatar', express.json(), validateUpdatedAvatar, updateAvatar);

module.exports = userRouter;
