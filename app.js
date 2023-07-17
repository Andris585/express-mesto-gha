const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
// const { cardsRoutes } = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use((req, _res, next) => {
  req.user = {
    _id: '64b55a8a5b7c0b252e505599',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(usersRouter);
// app.use(cardsRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Прослушивается порт: ${PORT}`);
});
