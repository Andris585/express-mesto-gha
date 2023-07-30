const usersRouter = require('express').Router();
const {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');
const {
  getUserByIdValidation,
  updateUserValidation,
  updateUserAvatarValidation,
} = require('../utils/validation');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUser);
usersRouter.get('/users/:userId', getUserByIdValidation, getUserById);
usersRouter.patch('/users/me', updateUserValidation, updateUser);
usersRouter.patch('/users/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = usersRouter;
