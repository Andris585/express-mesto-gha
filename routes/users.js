const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');
const {
  getUserByIdValidation,
  updateUserValidation,
  updateUserAvatarValidation,
} = require('../utils/validation');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserByIdValidation, getUserById);
usersRouter.patch('/users/me', updateUserValidation, updateUser);
usersRouter.patch('/users/me/avatar', updateUserAvatarValidation, updateUserAvatar);
usersRouter.get('/users/me', getUser);

module.exports = usersRouter;
