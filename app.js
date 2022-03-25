const express = require('express');
const { default: mongoose } = require('mongoose');
const userRoutes = require('./routes/users'); // импортируем роутер
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6231db00fac955a071ceccc1', //  _id пользователя
  };
  next();
});

app.use('/', userRoutes);

app.use('/', cardRoutes);

app.get('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не была найдена',
  });
});

app.listen(PORT);
