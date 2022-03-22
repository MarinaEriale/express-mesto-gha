const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/user");

const userRouter = require("express").Router();

userRouter.get("/users", getUsers);

// userRouter.get('/users/me', getMeEndpoint)

userRouter.get("/users/:userId", getUserById);

userRouter.post("/users", express.json(), createUser);

userRouter.patch("/users/me", express.json(), updateProfile);

userRouter.patch("/users/me/avatar", express.json(), updateAvatar);

module.exports = userRouter;
