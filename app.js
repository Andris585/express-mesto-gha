/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createNewUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFound = require('./errors/NotFound');
const errorHandler = require('./middlewares/errorHandler');
const { loginValidation, createNewUserValidation } = require('./utils/validation');


const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.post('/signin', loginValidation, login);
app.post('/signup', createNewUserValidation, createNewUser);
app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);
app.use('*', () => {
  throw new NotFound('Запрашиваемая страница не найдена');
});
app.use(errorHandler);
app.use(errors());
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Прослушивается порт: ${PORT}`);
});
